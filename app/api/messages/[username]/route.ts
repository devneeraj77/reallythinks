import { NextRequest, NextResponse } from "next/server";

import { Message } from "@/lib/schemas/message";
import redis from "@/lib/redis";

type Params = Promise<{ username: string }>

export async function GET(request: NextRequest, segmentData: { params: Params }) {
  const params = await segmentData.params
  const  username = params.username;
  try {
    const messages = await redis.lrange<Message>(`messages:${username}`, 0, -1);

    // Sort messages by recent timestamp (newest first)
    const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(sortedMessages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, segmentData: { params: Params }) {
  const params = await segmentData.params
  const  username = params.username;
  try {
    const { timestamp } = await request.json();

    // Fetch all messages
    const messages: Message[] = await redis.lrange(`messages:${username}`, 0, -1);

    // Find and remove the message by timestamp
    const updatedMessages = messages.filter((msg) => msg.timestamp !== timestamp);

    // Reset list in Redis
    await redis.del(`messages:${username}`);
    await redis.rpush(`messages:${username}`, ...updatedMessages);

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
