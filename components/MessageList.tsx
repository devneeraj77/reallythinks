import { FC } from "react";

interface Message {
  content: string;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: FC<MessageListProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <p className="text-gray-500">
        No messages yet. Share your profile link to get anonymous messages!
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {messages.map((message, index) => (
        <li
          key={index}
          className="p-4 border rounded-md shadow-sm bg-gray-50 hover:bg-gray-100"
        >
          <p className="text-gray-800 mb-2">{message.content}</p>
          <p className="text-sm text-gray-500">
            {new Date(message.timestamp).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
