// Import your Redis client
import redis from "@/lib/redis";
import SendMessage from "../../components/SendMessage"; // Adjust relative path as necessary

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;

  // Fetch user from Redis
  const user = await redis.get(`user:${username}`);

  // Check if the user exists and ensure the data is a valid string
  if (!user || typeof user !== "string") {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          This type of user not available
        </h1>
        <p className="text-gray-600">
          The username <strong>{username}</strong> does not exist or is invalid.
        </p>
      </div>
    );
  }

  // Parse the user data from Redis
  const userData = JSON.parse(user);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Send an Anonymous Message to {userData.username}
      </h1>
      <SendMessage receiver={userData.username} />
    </div>
  );
}
