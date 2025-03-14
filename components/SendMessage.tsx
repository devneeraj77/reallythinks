"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert"; // Import NextUI Alert
import { setCookie, getCookie } from "cookies-next"; // Using cookies-next for cookie management

interface SendMessageProps {
  receiver: string;
}

export default function SendMessage({ receiver }: SendMessageProps) {
  const [status, setStatus] = useState({
    success: true,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageCount, setMessageCount] = useState(0); // Track number of messages sent in the last 24 hours
  const [timeRemaining, setTimeRemaining] = useState(""); // Track remaining time in hours and minutes
  const [timeRemainingInSeconds, setTimeRemainingInSeconds] = useState(0); // Track remaining time in seconds for message limit

  // Check cookie for message count and last sent time
  useEffect(() => {
    const lastSentTime = getCookie(`lastSentTime_${receiver}`); // Store cookies per receiver
    const sentCount = getCookie(`messageCount_${receiver}`);

    // Ensure sentCount is parsed as a number and handle cases where the cookie might not exist
    const parsedSentCount = sentCount ? parseInt(sentCount.toString(), 10) : 0;

    if (lastSentTime) {
      const currentTime = Date.now();
      const timeDiff = currentTime - Number(lastSentTime);

      if (timeDiff < 24 * 60 * 60 * 1000) {
        // If within 24 hours
        setMessageCount(parsedSentCount);

        // Calculate time remaining for next message (in hours and minutes)
        const remainingMillis = 24 * 60 * 60 * 1000 - timeDiff;
        const hours = Math.floor(remainingMillis / (60 * 60 * 1000)); // Calculate remaining hours
        const minutes = Math.floor(
          (remainingMillis % (60 * 60 * 1000)) / (60 * 1000)
        ); // Calculate remaining minutes
        setTimeRemaining(`${hours}h ${minutes}m`);

        // Calculate remaining time in seconds for message limit
        setTimeRemainingInSeconds(
          Math.ceil((24 * 60 * 60 * 1000 - timeDiff) / 1000)
        ); // Time remaining in seconds for message limit
      } else {
        // Reset message count if more than 24 hours
        setMessageCount(0);
        setTimeRemaining("");
        setTimeRemainingInSeconds(0);
      }
    }
  }, [receiver]);

  const handleSendMessage = async () => {
    // Check if the user has sent 2 messages in the last 24 hours
    if (messageCount >= 2) {
      setStatus({
        success: false,
        message: `You can only send 2 messages within 24 hours. Please wait ${timeRemaining} seconds.`,
      });
      return;
    }

    // If the message is empty, display an error
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

        // Update message count and last sent time in cookies
        const currentTime = Date.now();
        const newMessageCount = messageCount + 1;
        setMessageCount(newMessageCount);

        setCookie(`messageCount_${receiver}`, newMessageCount, {
          maxAge: 24 * 60 * 60,
        }); // Store message count for 24 hours
        setCookie(`lastSentTime_${receiver}`, currentTime.toString(), {
          maxAge: 24 * 60 * 60,
        }); // Store last sent time
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
    <main className="min-h-screen">
      <div className="max-w-screen-sm border-1 border-[#5B8266] rounded-xl text-[#233329] px-4 pt-16 mx-auto pb-44 gap-4 grid">
        <div>
          <h2 className="text-lg  text-[#233329]  pt-6">
            Send an anonymous <br /> message to @{receiver}
          </h2>

          <Textarea
            className="max-w-xl pt-2 text-[#6A7152]"
            label="Anonymously"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            color="primary"
            onPress={handleSendMessage}
            className={`mt-4 h-10 bg-[#233329] rounded-md px-4 text-white transition-opacity ${
              loading ? "opacity-30" : ""
            }`}
          >
            Send Message
          </Button>

          {status.message && (
            <div className={`mt-2`}>
              <Alert
                color={status.success ? "success" : "danger"} // Set the color based on success or failure
                title={status.success ? "Success!" : "Error!"}
                description={status.message}
              />
            </div>
          )}

          {/* Display warning when there's a time limit */}
          {messageCount >= 2 && timeRemainingInSeconds > 0 && (
            <div className="mt-4">
              <Alert
                color="warning"
                title="Message Limit Reached"
                description={`Please wait ${timeRemainingInSeconds} seconds to send another message.`}
              />
            </div>
          )}
          {/* <div className="overflow-x-auto mt-8 text-sm bg-[#C2EFB3] text-[#233329] dark:bg-gray-800 rounded-md mt-6 px-3 py-2 ">
            <h2 className="text-md text-balance text-gray-600 dark:text-gray-400 pb-2">
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
          </div> */}
        </div>
      </div>
    </main>
  );
}
