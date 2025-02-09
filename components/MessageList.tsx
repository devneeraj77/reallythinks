"use client";

import { useEffect, useState } from "react";

type Message = {
  content: string;
  timestamp: string;
  receiver: string;
};

export default function MessageList({ username }: { username: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${username}`);
        const data = await response.json();

        if (response.ok) {
          setMessages(data.messages || []);
        } else {
          setError(data.error || "Error fetching messages");
        }
      } catch (err) {
        setError("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [username]);

  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-md mt-6 px-3 py-2 w-full">
      <h2 className="text-lg text-gray-600 dark:text-gray-400 pb-2">
        Messages
      </h2>
      {messages.length > 0 ? (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="font-semibold w-1/3 text-left">receiver</th>
              <th className="font-semibold w-1/3 text-left">Message</th>
              <th className="font-semibold w-1/3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message, index) => (
              <tr key={index}>
                <td className="text-gray-600 dark:text-gray-400">
                  {message.receiver}
                </td>
                <td className="text-gray-600 dark:text-gray-400">
                  {message.content}
                </td>
                <td className="text-gray-600 dark:text-gray-400">
                  {new Date(message.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-600">No messages found.</div>
      )}
    </div>
  );
}
