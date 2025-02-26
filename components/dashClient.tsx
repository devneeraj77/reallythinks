"use client";

import { useSession } from "next-auth/react";
import MessageList from "@/components/MessageList";
import { useState } from "react";
import InstaStoryShare from "./InstaStoryShare";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  if (status === "loading") {
    return <p>Loading your dashboard...</p>;
  }

  if (!session) {
    return <p>You must be logged in to view your dashboard.</p>;
  }

  // Assume the session user object has a "name" property.
  const username = session?.user?.name || "";

  return (
    <main className="container text-balance text-[#233329] dark:text-gray-400 mx-auto px-4 py-8">
      <h1 className="text-2xl  font-bold mb-4">Dashboard</h1>
      <p className="mb-6">
        Welcome, {username}! Here are your anonymous messages:
      </p>
      <MessageList username={username} />
      {selectedMessage && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Instagram Story Reply</h2>
          <InstaStoryShare username={username} message={selectedMessage} />
        </div>
      )}
    </main>
  );
}
