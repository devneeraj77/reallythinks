"use client";

import { useEffect, useState } from "react";

interface Message {
  receiver: string;
  content: string;
  timestamp: number;
}

interface MessageListProps {
  username: string;
  onSelectMessage: (message: string) => void;
}

export default function MessageList({ username, onSelectMessage }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${username}`);
        const data = await res.json();
        
        if (res.ok) {
          setMessages(data.messages || []);
        } else {
          setError(data.error || "Failed to fetch messages.");
        }
      } catch (err) {
        setError("An error occurred while fetching messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [username]);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8">
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.timestamp}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectMessage(msg.content)}
            >
              <p className="font-semibold">Anonymous Message:</p>
              <p>{msg.content}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(msg.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
