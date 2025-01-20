import redis from "@/lib/redis";

interface UserProfile {
  username: string;
  email: string;
  image: string;
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const userData = await redis.get(`user:${username}`);

  return <h1>my Username: {username}</h1>;
}
