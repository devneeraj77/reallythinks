import { NextResponse } from "next/server";
import redis from "@/lib/redis"; // Ensure you have Upstash Redis configured
import { z } from "zod";
import { MessageSchema } from "@/lib/schemas/message";

// Fetch messages for a specific user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const username = params;

    // Fetch messages list from Redis for the given username
    const messages = await redis.lrange(`messages:${username}`, 0, -1);

    if (!messages || messages.length === 0) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    // Parse messages safely (no need to use JSON.parse if they are stored as objects)
    const parsedMessages = messages
      .map((msg) => {
        try {
          return MessageSchema.parse(JSON.parse(msg));
        } catch (error) {
          return null; // Skip invalid messages
        }
      })
      .filter(Boolean); // Remove null values

    return NextResponse.json({ messages: parsedMessages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
