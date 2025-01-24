"use client";

import { useState } from "react";
import { z } from "zod";

const MessageSchema = z.object({
  receiver: z.string().min(1, "Receiver is required"),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(50, "Message cannot exceed 50 characters"),
});

type MessageData = z.infer<typeof MessageSchema>;

interface SendMessageProps {
  receiver: string;
}

export default function SendMessage({ receiver }: SendMessageProps) {
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSendMessage = async () => {
    try {
      // Validate the message before sending
      const validatedMessage: MessageData = MessageSchema.parse({
        receiver,
        content: message,
      });

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedMessage),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(""); // Clear input on success
        setStatusMessage("Message sent successfully!");
      } else {
        setStatusMessage(data.error || "Failed to send the message.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setStatusMessage(error.errors[0].message); // Show first validation error
      } else {
        console.error("Error sending message:", error);
        setStatusMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message here..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
      ></textarea>

      <button
        onClick={handleSendMessage}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
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
