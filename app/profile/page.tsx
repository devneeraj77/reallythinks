import { auth } from "@/auth";
import { SignIn } from "@/components/auth-components";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default async function UserButton() {
  const session = await auth();
  if (!session?.user) return <SignIn />;
  return (
    <div className="flex items-center gap-2 ">
      <Avatar className="h-32 w-32">
        <AvatarImage
          src={
            session.user.image ??
            `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(
              Math.random() * 100000
            ) + 1}&randomizeIds=true`
          }
          alt={session.user.name ?? ""}
        />
      </Avatar>
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">{session.user.name}</p>
        <p className="text-muted-foreground text-xs leading-none">
          {session.user.email}
        </p>
      </div>
    </div>
  );
}
