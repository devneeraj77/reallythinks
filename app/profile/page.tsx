import { auth } from "@/auth";
import { SignIn } from "@/components/auth-components";
import ProfileLinkPreview from "@/components/ProfileLinkPreview";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { User } from "@heroui/user";

export default async function UserButton() {
  const session = await auth();
  if (!session?.user) return <SignIn />;

  // Extract username, fallback to email or "anonymous"

  const username =
    session.user.name ||
    (session.user.email ? session.user.email.split("@")[0] : "anonymous");

  // Use profile image if available, else generate a DiceBear avatar
  const profileImage =
    session.user.image ??
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${
      Math.floor(Math.random() * 100000) + 1
    }&randomizeIds=true`;

  return (
    <section>
      <div className="border border-[#5B8266] h-80 max-w-3xl  p-4 rounded-2xl m-4 sm:m-auto">
        <div className="sm:flex flex-col justify-between  sm:items-start ">
          <User
            avatarProps={{
              src: `${profileImage}`,
            }}
            name={
              <Link
                isExternal
                color="success"
                href={`/${session.user.name}`}
                size="sm"
              >
                @{session.user.name}
              </Link>
            }
            description={session.user.email}
          />
          <div className=" w-full py-10 text-center">
            <Snippet
              color="default"
              variant="flat"
              size="sm"
              className=""
              hideSymbol
            >
              <span>reallythinks.vercel.app/{session.user.name}</span>
            </Snippet>
          </div>
        </div>
      </div>

      {/* Pass the extracted username and profile image */}
      <ProfileLinkPreview username={username} profileImage={profileImage} />
    </section>
  );
}
