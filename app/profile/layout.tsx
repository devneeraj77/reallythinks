import { auth } from "@/auth";
import { Metadata } from "next";
// Generate metadata dynamically based on the session
export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const title =
    `${session?.user?.name}'s on anonymously.` || "Default Blog Title";
  const description = "Default description for your reference."; // Fallback description
  return { title, description };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
    </html>
  );
}
