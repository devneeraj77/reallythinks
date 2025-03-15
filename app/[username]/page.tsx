import SendMessage from "@/components/SendMessage";
import redis from "@/lib/redis";
import { Chip } from "@heroui/chip";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { notFound } from "next/navigation";

// Adjust the path as necessary

async function getUser(username: string) {
  // Check if the user exists in Redis
  const userExists = await redis.exists(`user:${username}`);

  // Return the username if found, otherwise return null
  return userExists ? username : null;
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = await getUser((await params).username);

  if (!username) {
    return (
      <div className="h-80 flex justify-center items-center">
        <div className="bg-[#3E625918] rounded-sm py-4 max-w-xl m-auto flex flex-col items-center justify-center">
          <span>
            <IconAlertTriangleFilled height={40} width={40} />
          </span>
          <Chip
            size="sm"
            variant="light"
            className="text-center text-balance text-[#212922] rounded-lg py-8 px-6"
          >
            The user specified is not valid. Please check the URL for accuracy.
          </Chip>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <SendMessage receiver={username} />
    </div>
  );
}
