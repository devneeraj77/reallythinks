import redis from "@/lib/redis";
import { MessageSchema } from "@/lib/schemas/message";
import { NextResponse } from "next/server";
import { z } from "zod";

// API route to handle message sending
export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // Validate the incoming request body
    const validatedMessage = MessageSchema.parse(body);
    const { receiver, content, timestamp } = validatedMessage;

    // Check if the receiver exists in the database (or Redis in this case)
    const userExists = await redis.get(`user:${receiver}`);

    if (!userExists) {
      console.error("Receiver not found:", receiver);
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    // Proceed with storing the message if the receiver exists
    const message = {
      id: crypto.randomUUID(),
      receiver,
      content,
      timestamp,
    };

    // Store the message in Redis under the receiver's key
    await redis.rpush(`messages:${receiver}`, JSON.stringify(message));

    // Respond with a success message
    return new NextResponse(
      JSON.stringify({ success: true, message: "Message sent successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-message API:", error);

    if (error instanceof z.ZodError) {
      // Return validation errors if Zod schema validation fails
      return new NextResponse(
        JSON.stringify({ error: error.errors.map((err) => err.message) }),
        { status: 400 }
      );
    }

    // Return a generic error message
    return new NextResponse(
      JSON.stringify({ error: "An error occurred while sending the message." }),
      { status: 500 }
    );
  }
};
