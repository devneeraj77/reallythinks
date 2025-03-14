import { auth } from "@/auth";
import { SignIn } from "@/components/auth-components";
import ProfileLinkPreview from "@/components/ProfileLinkPreview";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { User } from "@heroui/user";
import { Metadata } from "next";

// Fetch session for authenticated user

export default async function UserButton() {
  const session = await auth();
  if (!session?.user)
    return (
      <div className="h-80 m-4 flex justify-center items-center">
        <Chip
          size="sm"
          className="text-center max-w-xl m-auto text-balance text-[#212922] rounded-lg shadow-md py-8 px-6"
        >
          You need to sign in for a profile if you have a ReallyThinks account
        </Chip>
      </div>
    );

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
    <section className="text-[#233329]">
      <div className="bg-[#3E625918] border-[#5B8266] h-80 max-w-3xl p-4 rounded-2xl m-4 sm:m-auto">
        <div className="sm:flex flex-col justify-between sm:items-start">
          <div>
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
          </div>
          <div className="w-full py-10 text-center border-t-1">
            <p className="text-[#3E6259] text-xs sm:text-base">
              Got your URL right here! Just copy and paste the Link sticker.
            </p>
            <Snippet
              color="default"
              variant="flat"
              size="sm"
              className="text-balance text-[#233329]"
              hideSymbol
            >
              <span>reallythinks.vercel.app/{session.user.name}</span>
            </Snippet>
          </div>
        </div>
        <p className="pt-4 text-left text-[#3E6259] text-xs sm:text-base">
          Received anonymous messages? Check them out on your /dashboard.
        </p>
      </div>

      {/* Pass the extracted username and profile image */}
      <ProfileLinkPreview username={username} profileImage={profileImage} />
    </section>
  );
}
