// src/components/MessageInput.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex items-center">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type a message…"
        className="flex-1 p-2 border rounded"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
        Send
      </button>
    </form>
  );
};

export default MessageInput;
