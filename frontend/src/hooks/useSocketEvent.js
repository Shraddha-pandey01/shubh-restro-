import { useEffect } from 'react';
import { getSocket } from '../services/socket.js';

/**
 * Custom hook to listen to real-time Socket.io events.
 * @param {string} eventName
 * @param {(data: any) => void} callback
 */
export const useSocketEvent = (eventName, callback) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !eventName || !callback) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [eventName, callback]);
};

export default useSocketEvent;
