import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { MessageSchema } from "@/lib/schemas/message";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const message = MessageSchema.parse(body);
    await redis.rpush(`messages:${message.receiver}`, JSON.stringify(message));
    return NextResponse.json({ success: true });
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    // Check if the error is an instance of Error
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
