// /src/pages/ChatPage.tsx

import React from 'react';
import { useChat } from '../hooks/useChat';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function ChatPage() {
  const {
    conversations,
    currentConversationId,
    messages,
    selectConversation,
    sendMessage
  } = useChat();

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        onSelect={selectConversation}
        currentId={currentConversationId}
      />
      <ChatWindow
        messages={messages}
        onSend={sendMessage}
      />
    </div>
  );
}
