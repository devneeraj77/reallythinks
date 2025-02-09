import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { providerMap, signIn } from "@/auth";
import redis from "@/lib/redis";

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

        return redirect(searchParams?.callbackUrl ?? "/dashboard");
      } else {
        throw new AuthError("Invalid credentials");
      }
    } catch (error) {
      if (error instanceof AuthError) {
        return redirect(`/new-user?error=${error.type}`);
      }
      throw error;
    }
  };

  return (
    <div className="flex flex-col border gap-2 p-4 w-80 mx-auto mt-10">
      <h2 className="text-xl font-semibold">Sign In</h2>

      {/* Sign-in Form with Credentials */}
      <form className="flex flex-col gap-2" action={handleSignIn}>
        <label htmlFor="username" className="font-medium">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="border p-2 rounded-md"
          required
        />

        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="border p-2 rounded-md"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Sign In with Credentials
        </button>
      </form>

      {/* Sign-in with Providers (Fixed `key` error) */}
      <div className="mt-4">
        <p className="text-center text-sm">Or sign in with</p>
        <div className="flex flex-col gap-2">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id} // ✅ FIXED: React key error
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
    </div>
  );
}
