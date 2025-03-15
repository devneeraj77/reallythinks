"use client";

import { useState, useEffect, useCallback } from "react";
import {
  IconRefresh,
  IconScreenshot,
  IconTrashFilled,
  IconX,
} from "@tabler/icons-react";
import InstaStoryShare from "./InstaStoryShare";
import { Button } from "@heroui/button";
import Link from "next/link";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Message {
  receiver: string;
  content: string;
  timestamp: number;
}

interface MessageListProps {
  username: string;
}

export default function MessageList({ username }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  //  Optimized fetchMessages with useCallback
  const fetchMessages = useCallback(async () => {
    if (!username) return;

    try {
      setRefreshing(true);
      const res = await fetch(`/api/messages/${username}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data: Message[] = await res.json();

      setMessages((prev) => {
        const sortedMessages = data.sort((a, b) => b.timestamp - a.timestamp);
        return JSON.stringify(prev) !== JSON.stringify(sortedMessages)
          ? sortedMessages
          : prev;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  //  Optimized handleDelete with useCallback
  const handleDelete = useCallback(
    async (timestamp: number) => {
      try {
        const res = await fetch(`/api/messages/${username}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timestamp }),
        });

        if (!res.ok) throw new Error("Failed to delete message");
        setMessages((prev) =>
          prev.filter((msg) => msg.timestamp !== timestamp)
        );
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
    [username]
  );

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    // If the message was sent within the last 60 seconds
    if (diff < 60) {
      return `${diff}s ago`;
    }

    // If the message was sent within the last 60 minutes
    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes}m ago`;
    }

    // If the message was sent within the last 3 hours
    if (diff < 10800) {
      const hours = Math.floor(diff / 3600);
      return `${hours}h ago`;
    }

    // For messages older than 3 hours, show the formatted date
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      dayPeriod: "narrow",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 bg-[#3E625918] text-balance text-[#233329] rounded-lg shadow-md ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button
          onClick={fetchMessages}
          disabled={refreshing}
          className={`p-2 rounded-full transition ${
            refreshing ? "animate-spin" : "hover:bg-gray-200"
          }`}
        >
          <IconRefresh className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        <ul className="border-blue-500 grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {messages.map((msg) => (
            <li
              key={msg.timestamp}
              className="m-3  text-[#212922]  rounded-lg shadow-sm   animate-fade-in"
            >
              <Card className="aspect-3/2">
                <CardHeader className="text-xs text-[#5B8266] py-2">
                  {getTimeAgo(msg.timestamp)}
                </CardHeader>
                <CardBody className="text-base text-[#212922]">
                  {msg.content}
                </CardBody>

                {/* <div className="flex-1 ">
                <p className="text-base text-[#212922]">{msg.content}</p>
                <span className="text-xs text-[#5B8266] py-2">
                  {getTimeAgo(msg.timestamp)}
                </span> gf
              </div> */}
                <CardFooter>
                  <div className="flex  w-full jusitify-center items-center gap-3  ">
                    <Button
                      as={Link}
                      href="#sharetodown"
                      size="sm"
                      color="default"
                      variant="flat"
                      onPress={() => setSelectedMessage(msg)}
                      className=" border-blue-200 w-full py-1 rounded-md"
                    >
                      {/* <IconShare className="w-5 h-5 mr-1" /> Share */}

                      <IconScreenshot className="w-5 h-5 m-1 text-[#212922]" />
                      {/* <IconTrash className="w-5 h-5 mr-1 text-red-500 hover:text-red-600 transition flex items-center " /> */}
                    </Button>
                    {/* <Button
                      size="sm"
                      color="default"
                      variant="flat"
                      onPress={() => handleDelete(msg.timestamp)}
                      className=" px-3 py-1  border-blue-200 w-full rounded-md "
                    >
                      <IconTrashFilled className="w-5 h-5 m-1 text-red-500 hover:text-red-600 transition flex items-center " />
                    
                    </Button> */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="flat"
                          size="sm"
                          color="default"
                          className=" border-blue-200 w-full py-1 rounded-md"
                        >
                          {" "}
                          <IconX className="w-5 h-5 m-1 text-[#212922]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                      >
                        <DropdownMenuLabel className="font-normal ">
                          <div className="flex flex-col space-y-1">
                            <p>Are you sure, delete.</p>
                            <Button
                              size="sm"
                              color="default"
                              variant="flat"
                              onPress={() => handleDelete(msg.timestamp)}
                              className=" px-3 py-1  border-blue-200 w-full rounded-md "
                            >
                              <IconTrashFilled className="w-5 h-5 m-1 text-red-500 hover:text-red-600 transition flex items-center " />
                            </Button>
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {selectedMessage && (
        <div className="mt-6">
          <InstaStoryShare
            message={selectedMessage.content}
            username={username}
          />
        </div>
      )}
    </div>
  );
}
