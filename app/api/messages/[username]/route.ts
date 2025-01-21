import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const messages = await redis.lrange(`messages:${params.username}`, 0, -1);
    return NextResponse.json(messages.map((msg) => JSON.parse(msg)));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
