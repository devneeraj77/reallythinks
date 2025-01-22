// components/MessageList.tsx
interface Message {
  id: string;
  sender: string | null;
  content: string;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((message) => (
          <div key={message.id} className="message-item">
            <p>
              <strong>
                {message.sender ? `From: ${message.sender}` : "Anonymous"}
              </strong>
            </p>
            <p>{message.content}</p>
            <p>{new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
