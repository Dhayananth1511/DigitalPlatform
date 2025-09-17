import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { P2PConnectionManager, PeerConnection, Message } from '../utils/p2pConnection';
import { useAuth } from './AuthContext';

interface P2PContextType {
  connectionManager: P2PConnectionManager | null;
  connectedPeers: PeerConnection[];
  messages: Message[];
  isConnecting: boolean;
  connectToPeer: (peerId: string, peerName: string) => Promise<void>;
  sendMessage: (peerId: string, content: string, type?: Message['type']) => void;
  broadcastMessage: (content: string, type?: Message['type']) => void;
  disconnect: (peerId: string) => void;
  clearMessages: () => void;
}

const P2PContext = createContext<P2PContextType | undefined>(undefined);

export const P2PProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [connectionManager, setConnectionManager] = useState<P2PConnectionManager | null>(null);
  const [connectedPeers, setConnectedPeers] = useState<PeerConnection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (user) {
      const manager = new P2PConnectionManager(user.id);
      
      manager.setCallbacks({
        onMessage: (message) => {
          setMessages(prev => [...prev, message]);
        },
        onPeerConnected: (peer) => {
          setConnectedPeers(prev => [...prev.filter(p => p.id !== peer.id), peer]);
          setIsConnecting(false);
        },
        onPeerDisconnected: (peerId) => {
          setConnectedPeers(prev => prev.filter(p => p.id !== peerId));
        }
      });

      setConnectionManager(manager);

      return () => {
        manager.disconnectAll();
      };
    }
  }, [user]);

  const connectToPeer = async (peerId: string, peerName: string) => {
    if (!connectionManager) return;
    
    setIsConnecting(true);
    try {
      await connectionManager.createConnection(peerId, peerName);
    } catch (error) {
      console.error('Failed to connect to peer:', error);
      setIsConnecting(false);
    }
  };

  const sendMessage = (peerId: string, content: string, type: Message['type'] = 'text') => {
    if (!connectionManager) return;
    
    const message = connectionManager.sendMessage(peerId, content, type);
    if (message) {
      setMessages(prev => [...prev, message]);
    }
  };

  const broadcastMessage = (content: string, type: Message['type'] = 'text') => {
    if (!connectionManager) return;
    
    const messages = connectionManager.broadcastMessage(content, type);
    setMessages(prev => [...prev, ...messages]);
  };

  const disconnect = (peerId: string) => {
    if (!connectionManager) return;
    
    connectionManager.disconnect(peerId);
    setConnectedPeers(prev => prev.filter(p => p.id !== peerId));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <P2PContext.Provider value={{
      connectionManager,
      connectedPeers,
      messages,
      isConnecting,
      connectToPeer,
      sendMessage,
      broadcastMessage,
      disconnect,
      clearMessages,
    }}>
      {children}
    </P2PContext.Provider>
  );
};

export const useP2P = () => {
  const context = useContext(P2PContext);
  if (context === undefined) {
    throw new Error('useP2P must be used within a P2PProvider');
  }
  return context;
};