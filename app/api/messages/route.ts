import { NextResponse } from "next/server";
import redis from "../../../lib/redis";

// Send an anonymous message to a user
export async function POST(request: Request) {
  try {
    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: "Recipient and message are required" },
        { status: 400 }
      );
    }

    const user = await redis.hgetall(`user:${to}`);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await redis.lpush(`messages:${to}`, message);

    // Automatically delete messages after one year
    await redis.expire(`messages:${to}`, 365 * 24 * 60 * 60); // 1 year in seconds

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// Fetch messages for a user
export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("user");
  if (!userId)
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });

  const messages = await redis.lrange(`messages:${userId}`, 0, -1);
  return NextResponse.json({ messages });
}
