// /app/api/check-user/route.ts
import { NextResponse } from "next/server";
import redis from "@/lib/redis"; // Import your Redis client

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the username exists in Redis
    const userExists = await redis.exists(`user:${username}`);

    if (userExists) {
      return NextResponse.json({ message: "User found", username });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error checking user in Redis:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
