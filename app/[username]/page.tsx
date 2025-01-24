import SendMessage from "@/components/SendMessage"; // Adjust the path as necessary
import { checkUserExists } from "@/lib/userCheck";
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params; // Normalize username
  // Validate if the user exists in the Redis database
  const userExists = await checkUserExists(username);

  if (!userExists) {
    console.error(`User "${username}" not found in the database.`);
    notFound(); // Redirect to the 404 page
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
