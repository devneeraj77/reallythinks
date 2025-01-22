"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import MessageList from "@/components/MessageList";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<any[]>([]); // Type as an array of objects
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (session?.user?.name) {
        try {
          const response = await fetch(`/api/messages/${session.user.name}`);
          if (!response.ok) {
            throw new Error("Failed to fetch messages.");
          }
          const data = await response.json();
          setMessages(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMessages();
  }, [session?.user?.name]);

  if (status === "loading") {
    return <p className="text-center">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center">Please log in to view your dashboard.</p>;
  }

  if (isLoading) {
    return <p className="text-center">Loading messages...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session?.user?.name}
      </h1>
      <p className="text-gray-500 mb-6">
        Here are the anonymous messages sent to you:
      </p>
      <MessageList messages={messages} /> {/* Pass messages as prop */}
    </div>
  );
};

export default DashboardPage;
