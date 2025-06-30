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
  to_user: string,
  limit = 50
): Promise<any[]> {
  const resp = await client.get<{ history: any[] }>(
    '/chat/history',
    { params: { to_user, limit } }
  )
  return resp.data.history
}

export interface MessagePayload {
  id: string
  conversationId: string
  from_user: string
  to_user: string
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
  to_user: string,
  content: string
): Promise<MessagePayload> {
  const resp = await client.post<MessagePayload>('/chat/send', {
    to_user,
    content,
  })
  return resp.data
}

export async function markRead(conversationId: string): Promise<void> {
  await client.post(`/chat/${conversationId}/read`);
}

