import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLatestVideos } from "@/lib/youtube";
import { generateVideoSummary } from "@/lib/openai";
import { sendVideoNotificationEmail } from "@/lib/email";

/**
 * 매일 아침 7시에 실행되는 크론 작업
 * 등록된 모든 채널을 확인하고 새 영상이 있으면 이메일 전송
 */
export async function GET(request: NextRequest) {
  // 보안: Authorization 헤더 확인 (Vercel Cron에서 자동으로 설정됨)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      );
    }

    // 활성화된 모든 채널 가져오기
    const channels = await db.channel.findMany({
      where: {
        isActive: true,
      },
    });

    const results = {
      checked: 0,
      newVideos: 0,
      emailsSent: 0,
      errors: [] as string[],
    };

    for (const channel of channels) {
      try {
        results.checked++;

        // 최신 영상 가져오기
        const videos = await getLatestVideos(channel.channelId, apiKey, 5);

        if (videos.length === 0) {
          continue;
        }

        // 가장 최신 영상 확인
        const latestVideo = videos[0];

        // 새 영상인지 확인
        if (
          channel.lastVideoId &&
          channel.lastVideoId === latestVideo.id
        ) {
          // 마지막 확인 시간만 업데이트
          await db.channel.update({
            where: { id: channel.id },
            data: { lastCheckedAt: new Date() },
          });
          continue;
        }

        // 새 영상 발견!
        results.newVideos++;

        // AI 요약 생성
        const summary = await generateVideoSummary(
          latestVideo.title,
          latestVideo.description,
          latestVideo.id
        );

        // 이메일 전송
        const emailSent = await sendVideoNotificationEmail({
          to: channel.email,
          channelName: channel.channelName || "알 수 없는 채널",
          videoTitle: latestVideo.title,
          videoUrl: `https://www.youtube.com/watch?v=${latestVideo.id}`,
          summary,
        });

        if (emailSent) {
          results.emailsSent++;
        }

        // 채널 정보 업데이트
        await db.channel.update({
          where: { id: channel.id },
          data: {
            lastVideoId: latestVideo.id,
            lastCheckedAt: new Date(),
          },
        });
      } catch (error) {
        const errorMessage = `Error processing channel ${channel.id}: ${error}`;
        console.error(errorMessage);
        results.errors.push(errorMessage);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Video check completed",
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check videos",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

