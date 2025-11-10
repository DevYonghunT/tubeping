export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

/**
 * YouTube 채널 URL에서 채널 ID 추출
 */
export function extractChannelId(url: string): string | null {
  // 다양한 YouTube URL 형식 지원
  const patterns = [
    /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/@([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * YouTube 채널 정보 가져오기
 */
export async function getChannelInfo(
  channelIdOrUrl: string,
  apiKey: string
): Promise<YouTubeChannel | null> {
  let channelId = channelIdOrUrl;

  // URL인 경우 ID 추출
  if (channelIdOrUrl.includes("youtube.com") || channelIdOrUrl.includes("youtu.be")) {
    channelId = extractChannelId(channelIdOrUrl) || channelIdOrUrl;
  }

  try {
    // 먼저 채널 ID로 시도
    let url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
    let response = await fetch(url);
    let data = await response.json();

    // 채널 ID로 찾지 못한 경우, 사용자명/커스텀 URL로 시도
    if (!data.items || data.items.length === 0) {
      url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelId}&type=channel&maxResults=1&key=${apiKey}`;
      response = await fetch(url);
      data = await response.json();

      if (data.items && data.items.length > 0) {
        channelId = data.items[0].snippet.channelId;
        url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
        response = await fetch(url);
        data = await response.json();
      }
    }

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const channel = data.items[0];
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.default.url,
    };
  } catch (error) {
    console.error("Error fetching channel info:", error);
    return null;
  }
}

/**
 * 채널의 최신 영상 가져오기
 */
export async function getLatestVideos(
  channelId: string,
  apiKey: string,
  maxResults: number = 5
): Promise<YouTubeVideo[]> {
  try {
    // 채널의 업로드 플레이리스트 ID 가져오기
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      return [];
    }

    const uploadsPlaylistId =
      channelData.items[0].contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return [];
    }

    // 플레이리스트에서 최신 영상 가져오기
    const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();

    if (!videosData.items) {
      return [];
    }

    return videosData.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.default.url,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error("Error fetching latest videos:", error);
    return [];
  }
}

