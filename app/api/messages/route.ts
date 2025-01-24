// @/app/api/send-message/route.ts
import redis from "@/lib/redis";
import { MessageSchema } from "@/lib/schemas/message";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // Parse the request body and validate it
    const body = await req.json();
    const validatedMessage = MessageSchema.parse(body); // Validate the incoming message with Zod

    const { receiver, ...messageData } = validatedMessage;

    // Log and check if the receiver exists in Redis
    // console.log("Validating receiver existence...");
    // const userExists = await redis.get(`user:${receiver}`);
    // if (!userExists) {
    //   console.error("Receiver not found:", receiver);
    //   return NextResponse.json(
    //     { error: "Receiver not found." },
    //     { status: 404 }
    //   );
    // }

    // Create a unique message ID and save it to the Redis list for the receiver
    const message = {
      receiver,
      ...messageData,
      // Generate a unique ID for the message
    };

    console.log("Saving message:", message);
    await redis.rpush(`messages:${receiver}`, JSON.stringify(message)); // Save the message

    // Return success response
    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
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

    // Generic error response
    return NextResponse.json(
      { error: "An error occurred while sending the message." },
      { status: 500 }
    );
  }
}
