"use client";

import { useState, useEffect, useCallback } from "react";
import { IconRefresh, IconShare, IconTrash } from "@tabler/icons-react";
import InstaStoryShare from "./InstaStoryShare";

interface Message {
  receiver: string;
  content: string;
  timestamp: number;
}

interface MessageListProps {
  username: string;
}

export default function MessageList({ username }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // ✅ Optimized fetchMessages with useCallback
  const fetchMessages = useCallback(async () => {
    if (!username) return;

    try {
      setRefreshing(true);
      const res = await fetch(`/api/messages/${username}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data: Message[] = await res.json();

      setMessages((prev) => {
        const sortedMessages = data.sort((a, b) => b.timestamp - a.timestamp);
        return JSON.stringify(prev) !== JSON.stringify(sortedMessages) ? sortedMessages : prev;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // ✅ Optimized handleDelete with useCallback
  const handleDelete = useCallback(
    async (timestamp: number) => {
      try {
        const res = await fetch(`/api/messages/${username}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timestamp }),
        });

        if (!res.ok) throw new Error("Failed to delete message");
        setMessages((prev) => prev.filter((msg) => msg.timestamp !== timestamp));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
    [username]
  );

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);
    return diff < 60 ? `${diff}s ago` : new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button
          onClick={fetchMessages}
          disabled={refreshing}
          className={`p-2 rounded-full transition ${refreshing ? "animate-spin" : "hover:bg-gray-200"}`}
        >
          <IconRefresh className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((msg) => (
            <li key={msg.timestamp} className="p-3 bg-white rounded-lg shadow-sm flex justify-between items-center animate-fade-in">
              <div>
                <p className="text-gray-800">{msg.content}</p>
                <span className="text-xs text-gray-500">{getTimeAgo(msg.timestamp)}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedMessage(msg)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center"
                >
                  <IconShare className="w-5 h-5 mr-1" /> Share
                </button>

                <button
                  onClick={() => handleDelete(msg.timestamp)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition flex items-center"
                >
                  <IconTrash className="w-5 h-5 mr-1" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedMessage && (
        <div className="mt-6">
          <InstaStoryShare message={selectedMessage.content} username={username} />
        </div>
      )}
    </div>
  );
}
