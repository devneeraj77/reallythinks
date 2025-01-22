"use client";

import { useState } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        receiver: (await params).username,
        content: message,
      }),
      headers: { "Content-Type": "application/json" },
    });
    setMessage("");
  };

  return (
    <div>
      <h1>Send an Anonymous Message to {(await params).username}</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
