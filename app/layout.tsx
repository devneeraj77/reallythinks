import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { HeroUIProvider } from "@heroui/react";

const inter = Inter({ subsets: ["latin"] });

const profileImage = `https://api.dicebear.com/9.x/thumbs/svg?seed=${
  Math.floor(Math.random() * 100000) + 1
}&randomizeIds=true`;

export const metadata: Metadata = {
  title: "Reallythinks - Anonymously. Speak freely. No strings attached.",
  description:
    "Reallythinks, the safest way to send and receive anonymous messages. Share your thoughts without revealing your identity and connect with others through completely private and secure messaging. Whether it's a confession, feedback, or just a fun surprise, your anonymity is guaranteed!",
  openGraph: {
    title: "Discover your hidden messages anywhere with Reallythinks presents.",
    description:
      "Reallythinks is a web application that allows users to send anonymous messages.",
    type: "website",
    url: "https://reallythinks.vercel.app/",
    siteName: "Reallythinks",
    images: {
      url: `${profileImage}`,
    },
  },
  twitter: {
    card: "summary_large_image",
    description: "",
    siteId: "7774646541651411874854",
    creator: "@uneerajrekwar",
    creatorId: "7774646541651411874854",
    title: "Reallythinks is anonymous.",
    images: [`${profileImage}`],
  },
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} text-[#212922] scroll-smooth`}>
        <Header />
        <HeroUIProvider>
          <main className="overflow-hidden min-h-screen ">{children}</main>
        </HeroUIProvider>
        <Footer />
      </body>
    </html>
  );
}
