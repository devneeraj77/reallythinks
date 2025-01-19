import { NextResponse } from "next/server";
import { userRegistrationSchema } from "@/lib/schemas/userSchema";

import { errorSchema } from "@/lib/schemas/errorSchema";
import redis from "@/lib/redis";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    // Validate the incoming data using the Zod schema
    userRegistrationSchema.parse(body);
  } catch (error) {
    // Handle error with zod error schema validation
    let errorResponse: any = { message: "Validation failed" };

    if (error instanceof Error) {
      // If the error is an instance of Error, check its message and other properties
      errorResponse.message = error.message;
      errorResponse.details = error.stack || "No stack trace available";
    }

    // Ensure the error response structure adheres to the error schema
    try {
      errorSchema.parse(errorResponse);
    } catch (zodError) {
      // Handle if error structure is incorrect
      errorResponse = { message: "Unknown error structure" };
    }

    return NextResponse.json(errorResponse, { status: 400 });
  }

  const { username, email, password } = body;

  // Check if the user already exists in the Redis database
  const existingUser = await redis.get(`user:${username}`);
  if (existingUser) {
    return NextResponse.json(
      { error: "Username already exists" },
      { status: 400 }
    );
  }

  // Create new user data
  const newUser = {
    username,
    email,
    password, // Store hashed password in production
    profilePic: "", // Default to empty or a default avatar URL
    lastActive: new Date().toISOString(),
  };

  // Save the new user in Redis
  await redis.set(`user:${username}`, JSON.stringify(newUser));

  return NextResponse.json({ message: "User registered successfully" });
}
