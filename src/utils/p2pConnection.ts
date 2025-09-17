export interface PeerConnection {
  id: string;
  name: string;
  status: 'connecting' | 'connected' | 'disconnected';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'lesson-share' | 'quiz-invite' | 'story-request';
}

export class P2PConnectionManager {
  private connections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private localId: string;
  private onMessageCallback?: (message: Message) => void;
  private onPeerConnectedCallback?: (peer: PeerConnection) => void;
  private onPeerDisconnectedCallback?: (peerId: string) => void;

  constructor(localId: string) {
    this.localId = localId;
  }

  setCallbacks(callbacks: {
    onMessage?: (message: Message) => void;
    onPeerConnected?: (peer: PeerConnection) => void;
    onPeerDisconnected?: (peerId: string) => void;
  }) {
    this.onMessageCallback = callbacks.onMessage;
    this.onPeerConnectedCallback = callbacks.onPeerConnected;
    this.onPeerDisconnectedCallback = callbacks.onPeerDisconnected;
  }

  async createConnection(peerId: string, peerName: string): Promise<void> {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    this.connections.set(peerId, peerConnection);

    // Create data channel
    const dataChannel = peerConnection.createDataChannel('messages', {
      ordered: true
    });
    
    this.setupDataChannel(dataChannel, peerId, peerName);
    this.dataChannels.set(peerId, dataChannel);

    // Handle incoming data channels
    peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      this.setupDataChannel(channel, peerId, peerName);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real implementation, send this to the peer via signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      if (state === 'connected') {
        this.onPeerConnectedCallback?.({
          id: peerId,
          name: peerName,
          status: 'connected'
        });
      } else if (state === 'disconnected' || state === 'failed') {
        this.onPeerDisconnectedCallback?.(peerId);
      }
    };
  }

  private setupDataChannel(channel: RTCDataChannel, peerId: string, peerName: string) {
    channel.onopen = () => {
      console.log(`Data channel opened with ${peerName}`);
    };

    channel.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        this.onMessageCallback?.(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    channel.onclose = () => {
      console.log(`Data channel closed with ${peerName}`);
    };
  }

  sendMessage(peerId: string, content: string, type: Message['type'] = 'text') {
    const channel = this.dataChannels.get(peerId);
    if (channel && channel.readyState === 'open') {
      const message: Message = {
        id: Date.now().toString(),
        senderId: this.localId,
        senderName: 'You',
        content,
        timestamp: new Date(),
        type
      };

      channel.send(JSON.stringify(message));
      return message;
    }
    return null;
  }

  broadcastMessage(content: string, type: Message['type'] = 'text') {
    const messages: Message[] = [];
    this.dataChannels.forEach((channel, peerId) => {
      const message = this.sendMessage(peerId, content, type);
      if (message) {
        messages.push(message);
      }
    });
    return messages;
  }

  disconnect(peerId: string) {
    const connection = this.connections.get(peerId);
    const channel = this.dataChannels.get(peerId);

    if (channel) {
      channel.close();
      this.dataChannels.delete(peerId);
    }

    if (connection) {
      connection.close();
      this.connections.delete(peerId);
    }
  }

  disconnectAll() {
    this.connections.forEach((_, peerId) => {
      this.disconnect(peerId);
    });
  }
}