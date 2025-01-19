import { auth } from "@/auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
      <span className="hidden text-sm sm:inline-flex">
        {session.user.email}
      </span>
      <div className="flex items-center space-x-4">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={
              session.user.image ??
              `https://api.dicebear.com/9.x/thumbs/svg?seed=${
                Math.floor(Math.random() * 100000) + 1
              }&randomizeIds=true`
            }
            alt={session.user.name ?? ""}
          />
        </Avatar>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">
            {session.user.name}
          </p>
          <p className="text-muted-foreground text-xs leading-none">
            {session.user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
