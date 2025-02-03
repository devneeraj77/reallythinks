// components/SendMessage.tsx
"use client";

import { useState } from "react";

export default function SendMessage({ receiver }: { receiver: string }) {
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatusMessage("Message cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      // Send a POST request to the send-message API
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver,
          content: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("");
        setStatusMessage("Message sent successfully!");
      } else {
        setStatusMessage(data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatusMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Send an Anonymous Message</h2>
      <form onSubmit={handleSendMessage} className="space-y-3">
        <textarea
          className="w-full border rounded p-2"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {statusMessage && (
        <p
          className={`mt-4 text-center ${
            statusMessage.includes("successfully")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
}
