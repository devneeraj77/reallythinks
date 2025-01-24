import redis from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  // Check if the username exists in Redis
  try {
    const userExists = await redis.exists(`user:${username}`);

    if (userExists) {
      return NextResponse.json({ message: "User found", username });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error checking receiver:", error);
    return NextResponse.json(
      { error: "Error validating receiver" },
      { status: 500 }
    );
  }
}
