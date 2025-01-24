"use client";

import { useState } from "react";

export default function UserPage({ params }: { params: { username: string } }) {
  const username = params.username.toLowerCase(); // Normalize username
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setStatusMessage("Message cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: username, // Use the username from the URL
          content: message,
          timestamp: Date.now(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(""); // Clear the input
        setStatusMessage("Message sent successfully!");
      } else {
        setStatusMessage(data.error || "Failed to send the message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatusMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">
        Send an anonymous message to {username}
      </h1>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message here..."
        className="w-full mt-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
      ></textarea>

      <button
        onClick={handleSendMessage}
        className={`w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        Send Message
      </button>

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
