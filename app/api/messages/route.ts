import redis from "@/lib/redis"; // Ensure this points to your Redis configuration
import { MessageSchema } from "@/lib/schemas/message";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    const validatedData = MessageSchema.parse(body);

    const { receiver, content, timestamp } = validatedData;

    // Check if the receiver exists in Redis
    const userExists = await redis.get(`user:${receiver}`);
    if (!userExists) {
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    // Save the message to the receiver's messages list
    const message = { content, timestamp };
    await redis.rpush(`messages:${receiver}`, JSON.stringify(message));

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors if the request is invalid
      return NextResponse.json(
        { error: error.errors.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
