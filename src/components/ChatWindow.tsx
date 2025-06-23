// src/components/ChatWindow.tsx
import React, { useRef, useEffect } from 'react';
import MessageInput from './MessageInput';

// Define the Message type locally so TS can check it,
// but it never generates a real JS import.
interface Message {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered';
}

interface Props {
  messages: Message[];
  onSend: (content: string) => void;
}

export default function ChatWindow({ messages, onSend }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-2">
            <strong>{m.from}:</strong> {m.content}
            <div className="text-xs text-gray-500">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={endRef} key="end-of-messages" />
      </div>
      <MessageInput onSend={onSend} />
    </div>
  );
}
