import SendMessage from "../../components/SendMessage"; // Adjust relative path as necessary

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Send an Anonymous Message to {(await params).username}
      </h1>
      <SendMessage receiver={(await params).username} />
    </div>
  );
}
