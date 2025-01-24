// /app/[username]/page.tsx
import { notFound } from "next/navigation";
import SendMessage from "@/components/SendMessage";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username.toLowerCase();

  // Fetch user validation from the API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/check-user?username=${username}`
  );

  if (!res.ok) {
    notFound(); // Redirect to a 404 page if the user doesn't exist
  }

  const { message } = await res.json();

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">
        Send an anonymous message to {username}
      </h1>
      <p className="text-center text-gray-500">{message}</p>
      <SendMessage receiver={username} />
    </div>
  );
}
