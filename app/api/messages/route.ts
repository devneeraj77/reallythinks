import redis from "@/lib/redis";
import { MessageSchema } from "@/lib/schemas/message";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedMessage = MessageSchema.parse(body);

    const { receiver, ...messageData } = validatedMessage;

    console.log("Validating receiver existence...");
    const userExists = await redis.exists(`users:${receiver}`);
    if (!userExists) {
      console.error("Receiver not found:", receiver);
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    const message = {
      ...messageData,
      id: crypto.randomUUID(),
    };

    console.log("Saving message:", message);
    await redis.rpush(`messages:${receiver}`, JSON.stringify(message));

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-message route:", error);
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
