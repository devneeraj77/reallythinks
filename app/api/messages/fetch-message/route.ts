import { NextResponse } from "next/server";
import redis from "@/lib/redis";

// This endpoint fetches messages for a user from Redis
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch messages for the given user from Redis
    const messages = await redis.lrange(`messages:${username}`, 0, -1);

    if (messages.length === 0) {
      return NextResponse.json(
        { message: "No messages found for this user" },
        { status: 404 }
      );
    }

    // Return messages in the response
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the messages." },
      { status: 500 }
    );
  }
}
