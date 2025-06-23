// src/services/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function createSocket(): Socket {
  // get the raw token from wherever you stored it
  const token = localStorage.getItem('token');
  const wsUrl = import.meta.env.VITE_WS_URL;   // e.g. "http://localhost:5000"
  if (!wsUrl) throw new Error('VITE_WS_URL is not defined');

  if (!socket) {
    const wsUrl = import.meta.env.VITE_WS_URL;
    if (!wsUrl) throw new Error('VITE_WS_URL not defined');

    socket = io(wsUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      auth: { token: localStorage.getItem('token') },
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] connected as', socket!.id);
    });
    socket.on('connect_error', (err) => {
      console.error('[Socket.IO] connect_error', err);
    });
    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO] disconnected:', reason);
    });
  } else {
    // Hot-reload will update auth
    socket.auth = { token: localStorage.getItem('token') };
  }

  return socket;
}