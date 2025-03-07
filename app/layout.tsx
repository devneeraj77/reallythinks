import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { HeroUIProvider } from "@heroui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reallythinks- Share anonymously. Speak freely. No strings attached.",
  description:
    "Reallythinks, the safest way to send and receive anonymous messages. Share your thoughts without revealing your identity and connect with others through completely private and secure messaging. Whether it's a confession, feedback, or just a fun surprise, your anonymity is guaranteed!",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Header />
        <HeroUIProvider>
          <main className="overflow-hidden min-h-screen ">{children}</main>
        </HeroUIProvider>
        <Footer />
      </body>
    </html>
  );
}
