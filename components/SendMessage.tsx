"use client";

import { useState } from "react";

export default function SendMessage({ receiver }: { receiver: string }) {
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to validate if the receiver exists by making a request to the API
  const validateReceiver = async (receiver: string) => {
    try {
      const response = await fetch(`/api/check-receiver?username=${receiver}`);

      if (!response.ok) {
        return false; // If receiver doesn't exist, return false
      }

      return true; // If receiver exists, return true
    } catch (error) {
      console.error("Error checking receiver:", error);
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setStatusMessage("Message cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      // Validate if receiver exists before sending the message
      const receiverExists = await validateReceiver(receiver);
      if (!receiverExists) {
        setStatusMessage("Receiver not found. Please check the username.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver,
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
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message here..."
        className="w-full mt-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
      ></textarea>

      <button
        onClick={handleSendMessage}
        disabled={loading}
        className={`w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ${
          loading ? "opacity-50" : ""
        }`}
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
