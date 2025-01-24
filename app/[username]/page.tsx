import SendMessage from "@/components/SendMessage";
import redis from "@/lib/redis";

import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username.toLowerCase();

  const userExists = await redis.exists(`user:${username}`);
  if (!userExists) {
    notFound();
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center">
        Send an anonymous message to {username}
      </h1>
      <SendMessage receiver={username} />
    </div>
  );
}
