// /app/api/send-message/route.ts
import { checkUserExists } from "@/lib/userCheck"; // Function to check user existence in Redis
import { NextResponse } from "next/server";
import { MessageSchema } from "@/lib/schemas/message";
import redis from "@/lib/redis"; // Assuming redis is already initialized
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const validatedMessage = MessageSchema.parse(body); // Zod validation

    const { receiver, content, timestamp } = validatedMessage;

    // Check if the receiver exists in the Redis database
    console.log("Validating receiver existence...");
    const userExists = await checkUserExists(receiver); // Validate the receiver username

    // If the user doesn't exist, return an error
    if (!userExists) {
      console.error("Receiver not found:", receiver);
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    // Check if the receiver matches the sender (from the username in the URL)
    if (receiver !== body.receiver) {
      console.error("Receiver mismatch:", receiver);
      return NextResponse.json(
        { error: "Receiver does not match the specified username." },
        { status: 400 }
      );
    }

    // Create a message object and save it to Redis
    const message = {
      id: crypto.randomUUID(),
      receiver,
      content,
      timestamp,
    };

    console.log("Saving message:", message);
    await redis.rpush(`messages:${receiver}`, JSON.stringify(message));

    // Return a success response
    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-message route:", error);

    // Handle Zod validation errors
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
