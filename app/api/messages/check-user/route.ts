import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Initialize Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new NextResponse(JSON.stringify({ error: "Username is required" }), {
      status: 400,
    });
  }

  try {
    console.log("Checking if user exists in Redis:", username);
    const userExists = await redis.exists(`user:${username}`);

    if (userExists) {
      return new NextResponse(
        JSON.stringify({ success: true, message: "User exists" }),
        { status: 200 }
      );
    } else {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Redis error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
