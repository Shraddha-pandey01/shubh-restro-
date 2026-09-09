import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL.trim().replace(/\/+$/, '');
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.trim().replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }
  return window.location.origin;
};

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });
  }
  return socket;
};

export default getSocket;
