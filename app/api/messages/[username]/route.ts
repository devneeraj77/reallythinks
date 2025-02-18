import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { z } from "zod";

// Zod validation schema
const MessageSchema = z.object({
  receiver: z.string(),
  content: z.string(),
  timestamp: z.number(),
});

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const  username  = (await params).username;

    const messages = await redis.lrange(`messages:${username}`, 0, -1);
    if (!messages || messages.length === 0) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const parsedMessages = messages
      .map((msg) => {
        try {
          return MessageSchema.parse(msg);
        } catch (error) {
          console.error("Invalid message format:", error);
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({ messages: parsedMessages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
