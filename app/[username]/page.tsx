import redis from "@/lib/redis";
import SendMessage from "../../components/SendMessage"; // Adjust the relative path as necessary
import { NextResponse } from "next/server";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  console.log("Validating receiver existence...");
  const userExists = await redis.exists(`user:${username}`);
  if (!userExists) {
    console.error("Receiver not found:", username);
    return NextResponse.json({ error: "Receiver not found." }, { status: 404 });
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Send an Anonymous Message to {username}
      </h1>
      <SendMessage receiver={username} />
    </div>
  );
}
