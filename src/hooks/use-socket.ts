import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuditStore } from '../store/useAuditStore';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './use-audits';

let socket: Socket | null = null;

export const useSocket = () => {
  const { setActiveAudit } = useAuditStore();
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    if (socket?.connected) return;

    // Standardize WebSocket URL derivation
    let wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    
    if (!wsUrl && process.env.NEXT_PUBLIC_API_URL) {
      // Derive WSS/WS from API URL if not explicitly provided
      const apiUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '');
      wsUrl = apiUrl.startsWith('https') 
        ? apiUrl.replace('https', 'wss') 
        : apiUrl.replace('http', 'ws');
    }

    wsUrl = wsUrl || 'http://localhost:8000';

    socket = io(wsUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      console.log('WebSocket Connected');
    });

    socket.on('audit_update', (data) => {
      console.log('Audit Update:', data);
      setActiveAudit(data);
    });

    socket.on('audit_completed', (data) => {
      console.log('Audit Completed:', data);
      // Invalidate both the list and the specific audit detail
      queryClient.invalidateQueries({ queryKey: queryKeys.audits });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit(data.audit_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.status(data.audit_id) });
    });

    socket.on('disconnect', () => {
      console.log('WebSocket Disconnected');
    });
  }, [setActiveAudit, queryClient]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      // Logic to decide if we should disconnect on unmount
    };
  }, [connect]);

  return { socket, connect, disconnect };
};
