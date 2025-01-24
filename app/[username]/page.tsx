import { NextResponse } from "next/server";
import SendMessage from "../../components/SendMessage";
import redis from "@/lib/redis";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // Extract the username from the params
  const { username } = await params;

  // Check if the receiver exists in the Redis database
  try {
    const userExists = await redis.exists(`user:${username}`);

    // If the receiver doesn't exist, return an error response
    if (!userExists) {
      console.error("Receiver not found:", username);
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    // If receiver exists, proceed to render the page content
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          Send an Anonymous Message to {username}
        </h1>
        <SendMessage receiver={username} />
      </div>
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while validating the receiver." },
      { status: 500 }
    );
  }
}
