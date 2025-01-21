"use client";

import { useState } from "react";

export default function Profile({ params }: { params: { username: string } }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ receiver: params.username, content: message }),
      headers: { "Content-Type": "application/json" },
    });
    setMessage("");
  };

  return (
    <div>
      <h1>Send an Anonymous Message to {params.username}</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
