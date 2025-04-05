import React, { useState, useEffect } from 'react';
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
import { supabase } from '../../lib/supabase';
import type { Message, Conversation } from '../../types';

function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onFilter
}: {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onFilter: (filter: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-gray-200 h-full flex flex-col">
      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-2">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onFilter('all')}
            className="flex-1 px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            All
          </button>
          <button
            onClick={() => onFilter('unread')}
            className="flex-1 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Unread
          </button>
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map(conversation => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition ${
              selectedId === conversation.id ? 'bg-indigo-50' : ''
            }`}
          >
            <div className="relative">
              <img
                src={conversation.participant.avatar_url}
                alt={conversation.participant.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conversation.unread_count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {conversation.unread_count}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 truncate">
                  {conversation.participant.name}
                </h3>
                <span className="text-xs text-gray-500">
                  {conversation.last_message && formatTime(conversation.last_message.created_at)}
                </span>
              </div>
              <p className={`text-sm truncate ${
                conversation.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {conversation.last_message?.content}
              </p>
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
          <span>{formatTime(message.created_at)}</span>
          {isOwn && (
            message.read ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function Chat() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      // Subscribe to new messages
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedConversation]);

  async function fetchConversations() {
    try {
      setLoading(true);
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          id,
          creator:creator_id (
            id,
            name,
            avatar_url,
            role
          ),
          brand:brand_id (
            id,
            name,
            avatar_url,
            role
          ),
          messages (
            id,
            content,
            created_at,
            sender_id,
            read
          )
        `)
        .eq(user?.role === 'brand' ? 'brand_id' : 'creator_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform conversations to match the expected format
      const transformedConversations = conversations?.map(conv => ({
        id: conv.id,
        participant: user?.role === 'brand' ? conv.creator : conv.brand,
        last_message: conv.messages?.[0] || null,
        unread_count: conv.messages?.filter(m => !m.read && m.sender_id !== user?.id).length || 0
      })) || [];

      setConversations(transformedConversations);
      if (transformedConversations.length > 0) {
        setSelectedConversation(transformedConversations[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(conversationId: string) {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(messages || []);

      // Mark messages as read
      if (messages?.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('conversation_id', conversationId)
          .eq('receiver_id', user?.id)
          .eq('read', false);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) return;

      const message = {
        conversation_id: selectedConversation,
        sender_id: user.id,
        receiver_id: conversation.participant.id,
        content: newMessage.trim(),
        read: false,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('messages')
        .insert([message]);

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) return null;

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Conversation List */}
      <ConversationList
        conversations={conversations}
        selectedId={selectedConversation}
        onSelect={setSelectedConversation}
        onFilter={() => {}}
      />

      {/* Chat Area */}
      {currentConversation ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader conversation={currentConversation} />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
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

export default Chat;