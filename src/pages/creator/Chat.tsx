import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  Search,
  Send,
  Clock,
  Check,
  CheckCheck,
  ChevronLeft,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Paperclip,
  Smile
} from 'lucide-react';
import type { Conversation, Message } from '../../types';

// Mock data for development
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participant: {
      id: 'brand1',
      name: 'Nike Marketing',
      avatar_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100',
      role: 'brand'
    },
    last_message: {
      id: 'msg1',
      sender_id: 'brand1',
      receiver_id: '123e4567-e89b-12d3-a456-426614174000',
      content: 'The storyboard looks great! Please proceed with the shooting.',
      read: true,
      created_at: '2025-02-15T14:30:00Z'
    },
    unread_count: 0
  },
  {
    id: 'conv2',
    participant: {
      id: 'brand2',
      name: 'Adidas Sports',
      avatar_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100&h=100',
      role: 'brand'
    },
    last_message: {
      id: 'msg2',
      sender_id: '123e4567-e89b-12d3-a456-426614174000',
      receiver_id: 'brand2',
      content: 'I have submitted the final video for review. Looking forward to your feedback!',
      read: false,
      created_at: '2025-02-18T09:15:00Z'
    },
    unread_count: 2
  },
  {
    id: 'conv3',
    participant: {
      id: 'brand3',
      name: 'Puma Lifestyle',
      avatar_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100',
      role: 'brand'
    },
    last_message: {
      id: 'msg3',
      sender_id: 'brand3',
      receiver_id: '123e4567-e89b-12d3-a456-426614174000',
      content: 'Great work! The campaign exceeded our expectations. Looking forward to working with you again.',
      read: true,
      created_at: '2025-02-10T16:45:00Z'
    },
    unread_count: 0
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg1',
    sender_id: 'brand1',
    receiver_id: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Hi! We loved your portfolio and would like to discuss our upcoming campaign.',
    read: true,
    created_at: '2025-02-15T10:00:00Z'
  },
  {
    id: 'msg2',
    sender_id: '123e4567-e89b-12d3-a456-426614174000',
    receiver_id: 'brand1',
    content: 'Thank you! I am very interested in working with Nike. Could you share more details about the campaign?',
    read: true,
    created_at: '2025-02-15T10:05:00Z'
  },
  {
    id: 'msg3',
    sender_id: 'brand1',
    receiver_id: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Of course! We are launching a new summer sports collection and need engaging content that showcases the versatility of our products.',
    read: true,
    created_at: '2025-02-15T10:10:00Z'
  },
  {
    id: 'msg4',
    sender_id: '123e4567-e89b-12d3-a456-426614174000',
    receiver_id: 'brand1',
    content: 'Sounds exciting! I have prepared a storyboard for the content. Would you like to review it?',
    read: true,
    created_at: '2025-02-15T14:20:00Z'
  },
  {
    id: 'msg5',
    sender_id: 'brand1',
    receiver_id: '123e4567-e89b-12d3-a456-426614174000',
    content: 'The storyboard looks great! Please proceed with the shooting.',
    read: true,
    created_at: '2025-02-15T14:30:00Z'
  }
];

function ConversationList({
  conversations,
  selectedId,
  onSelect
}: {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-gray-200 h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map(conversation => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition ${
              selectedId === conversation.id ? 'bg-indigo-50' : ''
            }`}
          >
            <img
              src={conversation.participant.avatar_url}
              alt={conversation.participant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 truncate">
                  {conversation.participant.name}
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(conversation.last_message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {conversation.last_message.content}
              </p>
              {conversation.unread_count > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-600 text-white text-xs font-medium rounded-full mt-1">
                  {conversation.unread_count}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatHeader({ conversation }: { conversation: Conversation }) {
  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-3">
        <button className="lg:hidden">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <img
          src={conversation.participant.avatar_url}
          alt={conversation.participant.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-medium text-gray-900">{conversation.participant.name}</h2>
          <p className="text-sm text-gray-500">
            {conversation.participant.role === 'brand' ? 'Brand' : 'Creator'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 transition">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 transition">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 transition">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <div className={`flex items-center gap-1 mt-1 text-xs ${isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>
          <span>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {isOwn && (
            message.read ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { user } = useAuthStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(mockConversations[0].id);
  const [newMessage, setNewMessage] = useState('');

  const currentConversation = mockConversations.find(conv => conv.id === selectedConversation);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    // In real app, send message to backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Conversation List */}
      <ConversationList
        conversations={mockConversations}
        selectedId={selectedConversation}
        onSelect={setSelectedConversation}
      />

      {/* Chat Area */}
      {currentConversation ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader conversation={currentConversation} />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === user.id}
              />
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '2.5rem', maxHeight: '10rem' }}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 transition"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 transition"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 transition"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}