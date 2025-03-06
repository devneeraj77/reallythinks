import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { HeroUIProvider } from "@heroui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextAuth.js Example",
  description:
    "This is an example site to demonstrate how to use NextAuth.js for authentication",
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
