import NextAuth from "next-auth";
import "next-auth/jwt";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import redis from "./lib/redis";
import { z } from "zod";
import type { Provider } from "next-auth/providers";

const CredentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const providers: Provider[] = [
  Google,
  Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      email: {
        label: "Email",
        type: "email",
        placeholder: "user@example.com",
      },
      username: {
        label: "Username",
        type: "text",
        placeholder: "yourusername",
      },
      name: { label: "Name", type: "text", placeholder: "Your Full Name" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials: unknown) => {
      // Validate credentials using the Zod schema
      const parsedCredentials = CredentialsSchema.safeParse(credentials);

      if (!parsedCredentials.success) {
        // If validation fails, throw an error with the validation issues
        throw new Error(
          parsedCredentials.error.errors.map((err) => err.message).join(", ")
        );
      }

      const { email, username, name, password } = parsedCredentials.data;

      // Fetch user from Redis
      const user = await redis.hgetall(`user:${username}`);

      // If user exists, validate the password
      if (user && user.password === password) {
        return { id: user.id, email: user.email, name: user.name };
      }

      // If user doesn't exist, create a new user
      if (!user) {
        const newUser = {
          id: crypto.randomUUID(),
          email,
          username,
          name,
          password, // Note: Hash passwords in production!
        };

        await redis.hset(`user:${username}`, newUser);
        return { id: newUser.id, email: newUser.email, name: newUser.name };
      }

      // If password is invalid, return null or an error (based on your preference)
      return user;
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UpstashRedisAdapter(redis, { baseKeyPrefix: "app2:" }),
  providers,
  basePath: "/auth",
  pages: {
    signIn: "/signin",
    // signOut: '/auth/signout',
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    async jwt({ token, trigger, session, profile, account }) {
      if (trigger === "update") token.name = session.user.name;
      if (profile) {
        
      }
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) session.accessToken = token.accessToken;

      return session;
    },
  },
  experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
