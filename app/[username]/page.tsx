"use client";

import { useState } from "react";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username.toLowerCase(); // Normalize username
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setStatusMessage("Message cannot be empty.");
      return;
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: username,
          content: message,
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
        className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
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
