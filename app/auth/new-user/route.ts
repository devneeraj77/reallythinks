// app/api/auth/signup/route.ts

import redis from "@/lib/redis";
import { UserSignupSchema } from "@/lib/schemas/userSchema";
import crypto from "crypto";

// Redis setup

export async function POST(req: Request) {
  const data = await req.json();

  try {
    // Validate user input using the Zod schema
    UserSignupSchema.parse(data); // This will throw if validation fails
  } catch (error) {
    return new Response("Invalid input", { status: 400 });
  }

  const { username, email, password, name } = data;

  // Check if the username already exists in Redis
  const existingUser = await redis.hgetall(`user:${username}`);
  if (existingUser) {
    return new Response("Username already exists", { status: 400 });
  }

  // Create the new user object
  const newUser = {
    id: crypto.randomUUID(),
    username,
    email,
    password, // Storing password as plain text (not recommended for production)
    name,
  };

  // Save the new user in Redis
  await redis.hset(`user:${username}`, newUser);

  return new Response("User registered successfully", { status: 200 });
}
