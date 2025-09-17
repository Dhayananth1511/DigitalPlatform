import React, { useState } from 'react';
import { useP2P } from '../contexts/P2PContext';
import { Users, MessageCircle, Wifi, WifiOff, Send, X, Plus } from 'lucide-react';

const P2PConnection: React.FC = () => {
  const { connectedPeers, messages, isConnecting, connectToPeer, sendMessage, disconnect, clearMessages } = useP2P();
  const [showChat, setShowChat] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPeer, setSelectedPeer] = useState<string>('');
  const [connectForm, setConnectForm] = useState({ peerId: '', peerName: '' });

  const handleConnect = async () => {
    if (connectForm.peerId && connectForm.peerName) {
      await connectToPeer(connectForm.peerId, connectForm.peerName);
      setConnectForm({ peerId: '', peerName: '' });
      setShowConnectModal(false);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedPeer) {
      sendMessage(selectedPeer, newMessage.trim());
      setNewMessage('');
    }
  };

  const mockPeers = [
    { id: 'peer1', name: 'Simran Kaur', status: 'connected' as const },
    { id: 'peer2', name: 'Ravi Kumar', status: 'connected' as const },
  ];

  const displayPeers = connectedPeers.length > 0 ? connectedPeers : mockPeers;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {showChat && (
        <div className="bg-white rounded-xl shadow-2xl w-80 h-96 mb-4 border">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900">Peer Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet</p>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-2 rounded-lg max-w-xs ${
                      message.senderId === 'you'
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.senderName} • {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="mb-2">
              <select
                value={selectedPeer}
                onChange={(e) => setSelectedPeer(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="">Select peer...</option>
                {displayPeers.map((peer) => (
                  <option key={peer.id} value={peer.id}>
                    {peer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !selectedPeer}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect to Peer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peer ID</label>
                <input
                  type="text"
                  value={connectForm.peerId}
                  onChange={(e) => setConnectForm({ ...connectForm, peerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter peer ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peer Name</label>
                <input
                  type="text"
                  value={connectForm.peerName}
                  onChange={(e) => setConnectForm({ ...connectForm, peerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter peer name"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleConnect}
                disabled={isConnecting || !connectForm.peerId || !connectForm.peerName}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
              <button
                onClick={() => setShowConnectModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-col space-y-2">
        {/* Peer Status */}
        <div className="bg-white rounded-full shadow-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {displayPeers.length > 0 ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {displayPeers.length} peers
              </span>
            </div>
            <button
              onClick={() => setShowConnectModal(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Toggle */}
        <button
          onClick={() => setShowChat(!showChat)}
          className={`bg-white rounded-full shadow-lg p-3 transition-all ${
            showChat ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {/* Connected Peers List */}
        {displayPeers.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-3 max-w-xs">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Connected Peers</h4>
            <div className="space-y-1">
              {displayPeers.map((peer) => (
                <div key={peer.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{peer.name}</span>
                  </div>
                  <button
                    onClick={() => disconnect(peer.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default P2PConnection;