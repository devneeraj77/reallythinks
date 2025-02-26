import SendMessage from "@/components/SendMessage";
import redis from "@/lib/redis";
import { notFound } from "next/navigation";

// Adjust the path as necessary

async function getUser(username: string) {
  // Check if the user exists in Redis
  const userExists = await redis.exists(`user:${username}`);

  // Return the username if found, otherwise return null
  return userExists ? username : null;
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = await getUser((await params).username);

  if (!username) {
    notFound();
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <SendMessage receiver={username} />
    </div>
  );
}
