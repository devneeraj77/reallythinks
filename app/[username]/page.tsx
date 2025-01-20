import redis from "@/lib/redis";

interface UserProfile {
  username: string;
  email: string;
  profile: string;
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const userData = await redis.get(`user:${username}`);

  if (!userData) {
    return <div>User not found</div>;
  }

  return <h1>my Username: {username}</h1>;
}
