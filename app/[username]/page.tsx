import redis from "@/lib/redis";
import SendMessage from "../../components/SendMessage"; // Adjust relative path as necessary
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // Check if the user exists in the Redis database
  const userExists = await redis.exists(`user:${(await params).username}`);
  if (!userExists) {
    return notFound(); // Return notFound() if user doesn't exist
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Send an Anonymous Message to {(await params).username}
      </h1>
      <SendMessage receiver={(await params).username} />
    </div>
  );
}
