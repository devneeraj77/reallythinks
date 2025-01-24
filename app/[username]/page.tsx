import SendMessage from "../../components/SendMessage"; // Adjust relative path as necessary

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username.toLowerCase(); // Normalize the username

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Send an Anonymous Message to {username}
      </h1>
      <SendMessage receiver={username} />
    </div>
  );
}
