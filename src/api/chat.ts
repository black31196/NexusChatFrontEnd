// src/api/chat.ts
import client from './client'

export interface ConversationSummary {
  id: string
  participants: string[]
  lastMessage?: { content: string; timestamp: string }
  unreadCount: number
}

/**
 * GET /api/v1/chat/conversations
 */
export async function fetchConversations(): Promise<
  ConversationSummary[]
> {
  const resp = await client.get<ConversationSummary[]>(
    '/chat/conversations'
  )
  return resp.data
}

/**
 * GET /api/v1/chat/history?to=<userId>&limit=<n>
 */
export async function fetchHistory(
  to: string,
  limit = 50
): Promise<any[]> {
  const resp = await client.get<{ history: any[] }>(
    '/chat/history',
    { params: { to, limit } }
  )
  return resp.data.history
}

export interface MessagePayload {
  id: string
  conversationId: string
  from: string
  to: string
  content: string
  timestamp: string
}

/**
 * GET /api/v1/chat/:conversationId/messages
 */
export async function fetchMessages(conversationId: string): Promise<MessagePayload[]> {
  const resp = await client.get<MessagePayload[]>(
    `/chat/${conversationId}/messages`
  );
  return resp.data;
}

/**
 * POST /api/v1/chat/send
 */
export async function sendMessage(
  to: string,
  content: string
): Promise<MessagePayload> {
  const resp = await client.post<MessagePayload>('/chat/send', {
    to,
    content,
  })
  return resp.data
}

export async function markRead(conversationId: string): Promise<void> {
  await client.post(`/chat/${conversationId}/read`);
}

