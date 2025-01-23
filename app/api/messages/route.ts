import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { z } from "zod";
import { MessageSchema } from "@/lib/schemas/message";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = MessageSchema.parse(body);

    // Check if the user exists in Redis
    const userExists = await redis.exists(`user:${message.receiver}`);
    if (!userExists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await redis.rpush(`messages:${message.receiver}`, JSON.stringify(message));
    return NextResponse.json({ success: true, message: "Message sent!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Check if the error is an instance of Error
    return NextResponse.json(
      { error: "An error occurred while sending the message." },
      { status: 500 }
    );
  }
}
