"use client";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState({
    success: true,
    count: 0,
    lastCalled: "Never",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/increment");
      const data = await res.json();

      if (data.success) {
        setStatus(data);
        setMessage("");
      } else {
        setMessage(data.message || "Error fetching data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatus({
        success: false,
        count: 0,
        lastCalled: "Unknown",
      });
      setMessage(
        "Error fetching data. Please check the environment variables."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen">
      <div className="max-w-screen-sm px-8 pt-16 mx-auto pb-44 gap-4 grid">
        {/* header */}

        <div>
          <h2 className="text-lg text-balance text-gray-600 dark:text-gray-400 pt-6">
            Click the button below to increment a counter stored at Redis.
          </h2>
          <button
            disabled={loading}
            className={`mt-2 h-8 rounded-md bg-emerald-500 px-4 text-white transition-opacity ${
              loading ? "opacity-30" : ""
            }`}
            onClick={handleClick}
          >
            Increment
          </button>
          {message && (
            <div className="text-red-600 dark:text-red-400 mt-2">
              Something went wrong: {message}
            </div>
          )}
        </div>
        <div className="overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-md mt-6 px-3 py-2 w-96">
          <h2 className="text-lg text-balance text-gray-600 dark:text-gray-400 pb-2">
            Results:
          </h2>
          <table className="table-auto w-full border-collapse">
            <tbody>
              <tr>
                <td className="font-semibold w-32">Count</td>
                <td className="text-gray-600 dark:text-gray-400">
                  {status.count}
                </td>
              </tr>
              <tr>
                <td className="font-semibold w-32">Last Called</td>
                <td className="text-gray-600 dark:text-gray-400">
                  {status.lastCalled}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
