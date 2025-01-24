import SendMessage from "@/components/SendMessage"; // Adjust the path as necessary
import redis from "@/lib/redis";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params; // Normalize username

  // Fetch the user from Upstash Redis
  const user = await redis.hgetall(`user:${username}`);

  // If user is not found, render a custom message or a 404 page
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold text-red-600">
          User could not be found
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          The username `&quot;{username}`&quot; does not exist in our database.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Send an Anonymous Message to {username}
      </h1>
      <SendMessage receiver={username} />
    </div>
  );
}
