// src/context/ChatContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode
} from 'react';
import { createSocket } from '../services/socket';
import type { Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import {
  fetchConversations,
  fetchMessages,
  sendMessage as sendMessageAPI,
  markRead
} from '../api/chat';

export interface Message {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered';
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatContextValue {
  conversations: Conversation[];
  currentConversationId?: string;
  messages: Message[];
  selectConversation: (id: string) => void;
  sendMessage: (content: string) => void;
}

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [conversations, setConversations]   = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>();
  const [messages, setMessages]             = useState<Message[]>([]);
  const socketRef = useRef<Socket>();

  // keep a ref to the latest convoId for the socket handler
  const currentConvRef = useRef<string>();
  useEffect(() => {
    currentConvRef.current = currentConversationId!;
    console.log('[ChatContext] currentConvRef →', currentConversationId);
  }, [currentConversationId]);

  // 1) Initialize socket once
  useEffect(() => {
    if (!token || !user || socketRef.current) {
      console.log('[ChatContext] skipping socket init');
      return;
    }

    console.log('[ChatContext] initializing socket…');
    const socket = createSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket.IO] emitting join', user.id);
      socket.emit('join', user.id);
    });

    socket.on('receive_message', (msg: Message) => {
      console.log('[Socket.IO] receive_message →', msg);
      console.log('  currentConvRef:', currentConvRef.current);

      setConversations(prev => {
        console.log('[ChatContext] before bump →', prev);
        const updated = prev.map(c => {
          if (c.id === msg.conversationId) {
            const newCount = c.id === currentConvRef.current
              ? 0
              : c.unreadCount + 1;
            return { ...c, lastMessage: msg, unreadCount: newCount };
          }
          return c;
        });
        console.log('[ChatContext] after bump →', updated);
        return updated;
      });

      if (msg.conversationId === currentConvRef.current) {
        console.log('[ChatContext] appending to messages');
        setMessages(prev => [...prev, msg]);
      }
    });

    // CLEANUP: un‐register listeners and disconnect
    return () => {
      console.log('[ChatContext] tearing down socket');
      socket.off('connect');
      socket.off('receive_message');
      socket.disconnect();
      socketRef.current = undefined as any;
    };
  }, [token, user]);

  // 2) Load convo list on token
  useEffect(() => {
    if (!token) return;
    fetchConversations()
      .then(cs => {
        console.log('[ChatContext] loaded conversations:', cs);
        setConversations(cs)
      })
      .catch(err => console.error('[ChatContext] fetchConvos failed', err));
  }, [token]);

  // 3) Selecting a conversation loads its history AND marks read
  const selectConversation = async (id: string) => {
    console.log('[ChatContext] selectConversation →', id);
    try {
      await markRead(id);
      console.log('[ChatContext] marked read on server for', id);
    } catch (err) {
      console.error('[ChatContext] markRead failed', err);
    }

    setCurrentConversationId(id);
    try {
      const msgs = await fetchMessages(id);
      console.log('[ChatContext] loaded messages:', msgs);
      setMessages(msgs);
      setConversations(prev =>
        prev.map(c => (c.id === id ? { ...c, unreadCount: 0 } : c))
      );
    } catch (e) {
      console.error('[ChatContext] fetchHistory failed', e);
      setMessages([]);
    }
  };

  // 4) sendMessage: optimistic + HTTP + socket
  const sendMessage = async (content: string) => {
    console.log('[ChatContext] sendMessage →', content);
    if (!socketRef.current || !user || !currentConversationId) {
      console.warn('[ChatContext] cannot send (missing socket/user/convo)');
      return;
    }

    const tempId = Date.now().toString();
    const optimistic: Message = {
      id: tempId,
      conversationId: currentConversationId,
      from: user.id,
      to: currentConversationId,
      content,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    setMessages(prev => [...prev, optimistic]);

    // HTTP persist
    try {
      const saved = await sendMessageAPI(currentConversationId, content);
      setMessages(prev =>
        prev.map(m =>
          m.id === tempId
            ? { ...m, id: saved.id, timestamp: saved.timestamp, status: 'sent' }
            : m
        )
      );
    } catch (err) {
      console.error('[ChatContext] sendMessageAPI failed', err);
    }

    // socket emit
    socketRef.current.emit(
      'send_message',
      optimistic,
      (ack: { id: string; timestamp: string }) => {
        console.log('[Socket.IO] send_message ack →', ack);
        setMessages(prev =>
          prev.map(m =>
            m.id === tempId
              ? { ...m, id: ack.id, timestamp: ack.timestamp, status: 'delivered' }
              : m
          )
        );
      }
    );
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        messages,
        selectConversation,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
