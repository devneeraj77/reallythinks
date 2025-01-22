"use client";

import { useState } from "react";

interface SendMessageProps {
  receiver: string;
}

export default function SendMessage({ receiver }: SendMessageProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const sendMessage = async () => {
    setStatus("sending");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver, content: message }),
      });

      if (response.ok) {
        setMessage("");
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message..."
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />
      <button
        onClick={sendMessage}
        disabled={status === "sending" || !message.trim()}
        className={`px-4 py-2 rounded ${
          status === "sending"
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
      >
        {status === "sending" ? "Sending..." : "Send"}
      </button>
      {status === "sent" && (
        <p className="text-green-500 mt-2">Message sent successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-500 mt-2">
          An error occurred. Please try again.
        </p>
      )}
    </div>
  );
}
