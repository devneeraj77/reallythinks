import redis from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch data from Redis (Get value of 'key')
    const data = await redis.get("key");
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch data from Redis" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();

    if (!key || !value) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    // Set the key-value pair in Redis
    await redis.set(key, value);
    return NextResponse.json({ message: "Data saved to Redis successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to save data to Redis" },
      { status: 500 }
    );
  }
}
