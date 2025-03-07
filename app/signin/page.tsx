import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { providerMap, signIn } from "@/auth";
import redis from "@/lib/redis";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Link from "next/link";

export default async function SignInPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  // ✅ Await the searchParams before using
  const searchParams = await searchParamsPromise;

  const handleSignIn = async (FormData: FormData) => {
    "use server";

    const username = FormData.get("username") as string;
    const password = FormData.get("password") as string;

    try {
      // Fetch user from Redis

      const user = await redis.hgetall(`user:${username}`);

      if (user && user.password === password) {
        await signIn("credentials", {
          username,
          email: user.email,
          password: user.password,
          name: user.name,
        });

        return redirect("/profile");
      } else {
        throw new AuthError("Invalid credentials");
      }
    } catch (error) {
      if (error instanceof AuthError) {
        return;
      }
      throw error;
    }
  };

  return (
    <div className="flex flex-col border-1 gap-2 p-4 w-80 rounded-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold text-[#5B8266]">Sign In</h2>

      {/* Sign-in Form with Credentials */}
      <form
        className="flex text-[#212922] flex-col gap-2"
        action={handleSignIn}
      >
        <Input
          isRequired
          errorMessage="Please enter a valid username"
          label="Username"
          labelPlacement="outside"
          name="username"
          placeholder="Enter your username"
          type="text"
        />

        <Input
          isRequired
          errorMessage="Please enter a valid username"
          label="Password"
          labelPlacement="outside"
          name="password"
          placeholder="Enter your password"
          type="password"
        />

        <Button
          type="submit"
          variant="flat"
          className="bg-[#212922] mt-2 text-[#5B8266]"
        >
          Sign In with Credentials
        </Button>
      </form>
      {/* Sign-in with Providers (Fixed `key` error) */}
      <div className="my-2">
        {/* <p className="text-center text-sm">Or with</p> */}
        <div className="flex flex-col gap-2">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id} // FIXED: React key error
              action={async () => {
                "use server";
                try {
                  await signIn(provider.id, {
                    redirectTo: searchParams?.callbackUrl ?? "/dashboard",
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`/new-user?error=${error.type}`);
                  }
                  throw error;
                }
              }}
            >
              <button
                type="submit"
                className="border p-2 w-full rounded-md hover:bg-gray-200"
              >
                Sign in with {provider.name}
              </button>
            </form>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-center">
        Don&apos;t have an account{" "}
        <Link
          href="/new-user"
          className="text-[#5B8266] active:hover:text-[#212922] underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
