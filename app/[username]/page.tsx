import SendMessage from "@/components/SendMessage";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username.toLowerCase(); // Normalize username

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">
        Send an anonymous message to {username}
      </h1>
      <p className="text-center text-gray-600 mb-4">
        Your message will remain anonymous.
      </p>

      {/* SendMessage Component */}
      <SendMessage receiver={username} />

      <p className="mt-6 text-center text-sm text-gray-500">
        Share your profile link to receive more anonymous messages!
      </p>
    </div>
  );
}
