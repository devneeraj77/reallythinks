"use client";

import { useSession } from "next-auth/react";
import MessageList from "@/components/MessageList";
import { useState } from "react";
import InstaStoryShare from "./InstaStoryShare";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  if (status === "loading") {
    return <p>Loading your dashboard...</p>;
  }

  if (!session) {
    return (
      <div className="h-80  flex justify-center items-center">
        <Chip
          size="sm"
          className="text-center max-w-xl m-auto bg-[#3E625918] text-balance text-[#212922] rounded-lg shadow-md  py-8 px-6"
        >
          You&apos;re in logged in click to through <br />{" "}
          <Link
            isBlock
            showAnchorIcon
            color="foreground"
            className="text-[#212922]"
            href="/profile"
          >
            Profile
          </Link>
        </Chip>
      </div>
    );
  }

  // Assume the session user object has a "name" property.
  const username = session?.user?.name || "";

  return (
    <main className="container text-balance mx-auto max-w-4xl text-[#233329] dark:text-gray-400 mx-auto px-4 py-8">
      <h1 className="text-2xl  font-bold mb-4">Dashboard</h1>
      <p className="mb-6">
        Welcome, {username} Here are your anonymous messages:
      </p>
      <MessageList username={username} />
      {selectedMessage && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Instagram Story Reply</h2>
          <InstaStoryShare username={username} message={selectedMessage} />
        </div>
      )}
    </main>
  );
}
