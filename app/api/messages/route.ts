import redis from "@/lib/redis";
import { MessageSchema } from "@/lib/schemas/message";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const validatedMessage = MessageSchema.parse(body);

    const { receiver, ...messageData } = validatedMessage;

    // Check if the receiver exists in Redis
    const userExists = await redis.exists(`users:${receiver}`);
    if (!userExists) {
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    // Save the message in the receiver's message list
    const message = {
      ...messageData,
      id: crypto.randomUUID(), // Generate a unique ID for the message
    };

    await redis.rpush(`messages:${receiver}`, JSON.stringify(message));

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json(
        { error: error.errors.map((err) => err.message) },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while sending the message." },
      { status: 500 }
    );
  }
}
