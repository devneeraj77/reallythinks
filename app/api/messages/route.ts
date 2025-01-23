// @/app/api/send-message/route.ts
import redis from "@/lib/redis";
import { MessageSchema } from "@/lib/schemas/message";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // Parse the incoming message body
    const body = await req.json();
    const validatedMessage = MessageSchema.parse(body); // Validate the message format with Zod

    const { receiver, ...messageData } = validatedMessage;

    // Check if the receiver exists in Redis database
    console.log("Validating receiver existence...");
    const userExists = await redis.exists(`user:${receiver}`);
    if (!userExists) {
      console.error("Receiver not found:", receiver);
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 } // Return 404 if the user doesn't exist
      );
    }

    // Prepare the message for saving
    const message = {
      ...messageData,
      id: crypto.randomUUID(), // Generate a unique ID for the message
    };

    console.log("Saving message:", message);
    await redis.rpush(`messages:${receiver}`, JSON.stringify(message)); // Save the message to Redis

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 } // Return success response
    );
  } catch (error) {
    console.error("Error in send-message route:", error);

    // Handle validation errors from Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((err) => err.message) },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "An error occurred while sending the message." },
      { status: 500 }
    );
  }
}
