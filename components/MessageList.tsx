"use client";

import { useEffect, useState } from "react";

interface Message {
  receiver: string;
  content: string;
  timestamp: number;
}

export default function MessageList({ username }: { username: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/fetch-message${username}`);
        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Error fetching messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [username]);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className="p-2 bg-white dark:bg-gray-700 rounded-md">
              <p className="text-gray-800 dark:text-gray-300">{msg.content}</p>
              <p className="text-sm text-gray-500">
                Sent: {new Date(msg.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
