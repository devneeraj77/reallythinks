import NextAuth from "next-auth";
import "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import redis from "./lib/redis";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UpstashRedisAdapter(redis),
  providers: [
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
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { email, username, name, password } = credentials;

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

          await redis.hset(`user:${email}`, newUser);
          return { id: newUser.id, email: newUser.email, name: newUser.name };
        }

        // If password is invalid, return null
        // return null
        return user;
      },
    }),
  ],
  basePath: "/auth",
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name;
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
