"use client";
import { useState } from "react";

export default function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    const res = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ to: params.username, message }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("");
      alert("Message sent!");
    } else {
      alert("Failed to send message.");
    }
  };

  return (
    <div>
      <h1>Send Anonymous Message to {params.username}</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
}
