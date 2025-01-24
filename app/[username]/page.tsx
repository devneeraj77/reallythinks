import SendMessage from "@/components/SendMessage"; // Adjust path if necessary

export default async function UserPage({
  params,
}: {
  params: Promise<{ receiver: string }>;
}) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Send an Anonymous Message to {(await params).receiver}
      </h1>
      <SendMessage receiver={(await params).receiver} />
    </div>
  );
}
