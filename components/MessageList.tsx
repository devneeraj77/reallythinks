interface Message {
  sender: string | null;
  content: string;
  timestamp: string; // Assuming the timestamp is in string format, adjust as needed.
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
        messages.map((message, index) => (
          <div
            key={index}
            className="message-item p-4 mb-4 bg-gray-100 rounded-md shadow-sm"
          >
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
