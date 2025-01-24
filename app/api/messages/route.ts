import redis from "@/lib/redis"; // Ensure Redis is configured in your app
import { z } from "zod";
import { NextResponse } from "next/server";
import { MessageSchema } from "@/lib/schemas/message";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedMessage = MessageSchema.parse(body);

    const { receiver, ...messageData } = validatedMessage;

    // Check if the receiver exists in Redis
    const userExists = await redis.get(`user:${receiver}`);
    if (!userExists) {
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    // Add a unique ID to the message
    const message = {
      ...messageData,
      id: crypto.randomUUID(),
    };

    // Save the message in Redis under the receiver's key
    await redis.rpush(`messages:${receiver}`, JSON.stringify(message));

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-message API:", error);

    if (error instanceof z.ZodError) {
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
