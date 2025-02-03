import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET() {
  try {
    // Test setting a value in Redis
    await redis.set("connection_test", "success");
    const result = await redis.get("connection_test");

    return NextResponse.json({
      success: true,
      message: "Connected!",
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to connect.",
      error,
    });
  }
}
