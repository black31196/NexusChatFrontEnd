// src/api/auth.ts
import client from './client'

export interface LoginResponse {
  token: string
  user: { id: string; username: string; role: string }
}

/**
 * POST /api/v1/auth/login
 */
export const loginAPI = (username: string, password: string) =>
  client.post('/auth/login', { username, password }).then(r => r.data);

/**
 * POST /api/v1/auth/register
 * Only admins should ever call this
 */
export interface RegisterPayload {
  username: string
  email: string
  password: string
  role: string
}
export async function registerAPI(
  data: RegisterPayload
): Promise<void> {
  await client.post('/auth/register', data)
}

/**
 * POST /api/v1/auth/logout
 */
export const logoutAPI = () =>
  client.post('/auth/logout');

export const profileAPI = () =>
  client.get('/auth/me').then(r => r.data);
