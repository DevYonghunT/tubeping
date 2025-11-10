import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface VideoSummary {
  title: string;
  summary: string;
  keyPoints: string[];
}

/**
 * YouTube 영상 정보를 기반으로 AI 요약 생성
 */
export async function generateVideoSummary(
  videoTitle: string,
  videoDescription: string,
  videoId?: string
): Promise<VideoSummary> {
  try {
    const prompt = `다음 유튜브 영상 정보를 바탕으로 간결하고 읽기 쉬운 요약을 작성해주세요.

제목: ${videoTitle}
설명: ${videoDescription.substring(0, 2000)}${videoDescription.length > 2000 ? "..." : ""}

다음 JSON 형식으로 응답해주세요:
{
  "title": "영상 제목",
  "summary": "영상 내용의 핵심 요약 (3-5문장)",
  "keyPoints": ["주요 포인트 1", "주요 포인트 2", "주요 포인트 3"]
}

응답은 반드시 유효한 JSON 형식이어야 하며, 한국어로 작성해주세요.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "당신은 유튜브 영상 내용을 간결하고 명확하게 요약하는 전문가입니다. 항상 유효한 JSON 형식으로 응답하세요.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content from OpenAI");
    }

    const parsed = JSON.parse(content);
    return {
      title: parsed.title || videoTitle,
      summary: parsed.summary || "요약을 생성할 수 없습니다.",
      keyPoints: parsed.keyPoints || [],
    };
  } catch (error) {
    console.error("Error generating summary:", error);
    // Fallback 요약
    return {
      title: videoTitle,
      summary: videoDescription.substring(0, 200) || "요약을 생성할 수 없습니다.",
      keyPoints: [],
    };
  }
}

