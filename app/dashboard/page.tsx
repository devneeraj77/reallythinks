import { auth } from "auth";
import { SessionProvider } from "next-auth/react";
import DashClient from "@/components/dashClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Anonymously. Speak freely. No strings attached.",
  description:
    "Reallythinks, the safest way to send and receive anonymous messages. Share your thoughts without revealing your identity and connect with others through completely private and secure messaging. Whether it's a confession, feedback, or just a fun surprise, your anonymity is guaranteed!",
};

export default async function ClientPage() {
  const session = await auth();
  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  return (
    <SessionProvider basePath={"/auth"} session={session}>
      <DashClient />
    </SessionProvider>
  );
}
