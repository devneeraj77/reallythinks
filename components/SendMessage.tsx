"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

interface SendMessageProps {
  receiver: string;
}

export default function SendMessage({ receiver }: SendMessageProps) {
  const { data: session } = useSession();
  const [status, setStatus] = useState({
    success: true,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!session?.user) return null;
  const handleSendMessage = async () => {
    if (!message.trim()) {
      setStatus({
        success: false,
        message: "Message cannot be empty.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver,
          content: message,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({
          success: true,
          message: "Message sent successfully!",
        });
        setMessage(""); // Clear the message input
      } else {
        setStatus({
          success: false,
          message: data.error || "Failed to send the message.",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({
        success: false,
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen">
      <div className="max-w-screen-sm px-8 pt-16 mx-auto pb-44 gap-4 grid">
        {/* Header */}
        <div>
          <h2 className="text-lg text-balance text-gray-600 dark:text-gray-400 pt-6">
            Send an anonymous message to {receiver}
          </h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full mt-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
          ></textarea>
          <button
            disabled={loading}
            onClick={handleSendMessage}
            className={`mt-4 h-10 w-full rounded-md bg-blue-500 px-4 text-white transition-opacity ${
              loading ? "opacity-30" : ""
            }`}
          >
            Send Message
          </button>
          {status.message && (
            <div
              className={`mt-2 ${
                status.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.message}
            </div>
          )}
        </div>
        <div className="overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-md mt-6 px-3 py-2 w-96">
          <h2 className="text-lg text-balance text-gray-600 dark:text-gray-400 pb-2">
            Message Status:
          </h2>
          <table className="table-auto w-full border-collapse">
            <tbody>
              <tr>
                <td className="font-semibold w-32">Status</td>
                <td className="text-gray-600 dark:text-gray-400">
                  {status.success ? "Success" : "Failed"}
                </td>
              </tr>
              <tr>
                <td className="font-semibold w-32">Message</td>
                <td className="text-gray-600 dark:text-gray-400">
                  {status.message}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
