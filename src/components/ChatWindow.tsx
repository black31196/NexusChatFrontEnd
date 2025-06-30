// src/components/ChatWindow.tsx
import React, { useRef, useEffect } from 'react';
import MessageInput from './MessageInput';

// Define the Message type locally so TS can check it,
// but it never generates a real JS import.
interface Message {
  id: string;
  conversationId: string;
  from_user: string;
  to_user: string;
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered';
  message_type: 'text' | 'image' | 'sticker'; 
  file_id: string;    
  package_id: string;
  sticker_id: string;
}

interface Props {
  messages: Message[];
  onSend: (content: string) => void;
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const renderMessageContent = () => {
    switch (message.message_type) {
      // --- CASE 1: Render an Image ---
      case 'image':
        // This URL points to the GET /image/:fileId endpoint you created on your backend
        const imageUrl = `${import.meta.env.VITE_API_BASE_URL}/chat/image/${message.file_id}`;
        
        console.log("Rendering image with URL:", imageUrl);

        return (
          <img
            src={imageUrl}
            alt="Chat image"
            className="max-w-xs max-h-64 rounded-lg"
          />
        );

      // --- CASE 2: Render a Sticker ---
      case 'sticker':
        // Displaying LINE stickers directly is tricky as their URLs are protected.
        // The most reliable way is to show a placeholder.
        return (
          <div className="text-gray-500 italic">
            [Sticker sent]
          </div>
        );

      // --- CASE 3 (Default): Render Text ---
      case 'text':
      default:
        return <span>{message.content}</span>;
    }
  };

  return (
    <div className="mb-4"> {/* Increased margin for better spacing */}
      <strong>{message.from_user}:</strong>
      <div className="mt-1">{renderMessageContent()}</div> {/* Wrapper for content */}
      <div className="text-xs text-gray-500 mt-1">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default function ChatWindow({ messages, onSend }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={endRef} key="end-of-messages" />
      </div>
      <MessageInput onSend={onSend} />
    </div>
  );
}
