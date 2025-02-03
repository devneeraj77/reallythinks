"use client";

import { useSession } from "next-auth/react";
import MessageList from "@/components/MessageList";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading your dashboard...</p>;
  }

  if (!session) {
    return <p>You must be logged in to view your dashboard.</p>;
  }

  // Assume the session user object has a "name" property.
  const username = session?.user?.name || "";

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">
        Welcome, {username}! Here are your anonymous messages:
      </p>
      <MessageList username={username} />
    </main>
  );
}
