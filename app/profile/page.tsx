"use client";

import { auth } from "@/auth";
import { useRouter } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session?.user) {
    router.push("/login");
    return <p>Redirecting to login...</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      fdsafa
      <div className="flex items-center space-x-4">
        <img
          src={session.user.image || "/default-avatar.png"}
          alt="Profile Picture"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {session.user.name || "Unknown User"}
          </h2>
        </div>
      </div>
    </div>
  );
}
