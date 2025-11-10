import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getChannelInfo, extractChannelId } from "@/lib/youtube";

// GET: 채널 목록 조회
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const channels = await db.channel.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ channels });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 }
    );
  }
}

// POST: 새 채널 등록
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { channelUrl, email } = body;

    if (!channelUrl || !email) {
      return NextResponse.json(
        { error: "Channel URL and email are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      );
    }

    // 채널 정보 가져오기
    const channelInfo = await getChannelInfo(channelUrl, apiKey);
    if (!channelInfo) {
      return NextResponse.json(
        { error: "Invalid channel URL or channel not found" },
        { status: 400 }
      );
    }

    // 이미 등록된 채널인지 확인
    const existingChannel = await db.channel.findFirst({
      where: {
        userId: session.user.id,
        channelId: channelInfo.id,
      },
    });

    if (existingChannel) {
      return NextResponse.json(
        { error: "Channel already registered" },
        { status: 400 }
      );
    }

    // 채널 저장
    const channel = await db.channel.create({
      data: {
        userId: session.user.id,
        channelUrl,
        channelId: channelInfo.id,
        channelName: channelInfo.title,
        email,
      },
    });

    return NextResponse.json({ channel }, { status: 201 });
  } catch (error) {
    console.error("Error creating channel:", error);
    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    );
  }
}

