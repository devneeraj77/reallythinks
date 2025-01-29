import SendMessage from "@/components/SendMessage";

// Adjust the path as necessary
export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params; // Normalize username

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Send an Anonymous Message to {username}
      </h1>
      <SendMessage receiver={username} />
    </div>
  );
}
