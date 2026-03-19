'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Send, MessageCircle, User, Loader2, ArrowLeft, MoreVertical, Smartphone } from 'lucide-react';
import Image from 'next/image';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('chatId');

  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  // Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chats');
        const data = await res.json();
        setChats(data);
        
        if (initialChatId && !activeChat) {
          const found = data.find((c: any) => c.id === initialChatId);
          if (found) {
            setActiveChat(found);
            setIsMobileListOpen(false);
          }
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [initialChatId]);

  // Fetch messages for active chat (polling)
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chats/${activeChat.id}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [activeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/chats/${activeChat.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });

      if (res.ok) {
        const msg = await res.json();
        setMessages([...messages, msg]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getOtherUser = (chat: any) => {
    // This is a simplification; in a real app, compare with session.user.id
    // For now, if we're in the list, we show the names available.
    return chat.seller.name === 'You' ? chat.buyer : chat.seller; 
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-bg">
        <Loader2 className="w-10 h-10 animate-spin text-electricPurple" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-soft-bg flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-28 pb-6 flex gap-6 overflow-hidden">
        {/* Chats Sidebar */}
        <div className={`w-full lg:w-96 flex flex-col gap-4 ${!isMobileListOpen ? 'hidden lg:flex' : 'flex'}`}>
          <h1 className="text-2xl font-black text-deepIndigo px-2">Messages</h1>
          <GlassCard className="flex-1 overflow-hidden flex flex-col p-2 bg-white/70">
            <div className="overflow-y-auto flex-1 space-y-1 pr-1">
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                  <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold">No conversations yet</p>
                  <p className="text-xs">Browse the marketplace to start a chat</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChat(chat);
                      setIsMobileListOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeChat?.id === chat.id ? 'bg-electricPurple text-white shadow-lg shadow-electricPurple/20' : 'hover:bg-white/50 text-deepIndigo'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 font-bold text-electricPurple relative">
                       {getOtherUser(chat).name?.charAt(0)}
                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="text-left overflow-hidden">
                      <div className={`font-bold truncate ${activeChat?.id === chat.id ? 'text-white' : 'text-deepIndigo'}`}>
                        {getOtherUser(chat).name}
                      </div>
                      <div className={`text-xs truncate opacity-70`}>
                        {chat.product.title}
                      </div>
                      {chat.messages?.[0] && (
                        <div className={`text-[10px] mt-1 truncate italic opacity-60`}>
                           {chat.messages[0].content}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Chat Main View */}
        <div className={`flex-1 flex flex-col gap-4 overflow-hidden ${isMobileListOpen ? 'hidden lg:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsMobileListOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-electricPurple">
                    {getOtherUser(activeChat).name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-black text-deepIndigo leading-none">{getOtherUser(activeChat).name}</h2>
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="hidden sm:flex bg-white/50 border-white text-xs py-1">
                    {activeChat.product.title}
                  </Badge>
                  <button className="p-2 text-gray-400 hover:text-deepIndigo transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <GlassCard className="flex-1 p-6 relative flex flex-col bg-white/50 backdrop-blur-xl border-white/50 overflow-hidden shadow-2xl">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.senderId === activeChat.buyerId ? 'justify-end' : 'justify-start'}`} // Simplified logic
                    >
                      <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm relative group ${msg.senderId === activeChat.buyerId ? 'bg-electricPurple text-white rounded-br-none' : 'bg-white text-deepIndigo rounded-bl-none'}`}>
                        {msg.content}
                        <div className={`text-[9px] mt-1 opacity-50 ${msg.senderId === activeChat.buyerId ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50 italic">
                      No messages yet. Say hello!
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="mt-6 flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      required
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full pl-6 pr-12 py-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-electricPurple/20 focus:border-electricPurple shadow-sm transition-all text-sm font-medium"
                    />
                    <button 
                      type="submit" 
                      disabled={isSending || !newMessage.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-electricPurple text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-electricPurple/20"
                    >
                      {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </form>
              </GlassCard>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-6 text-electricPurple rotate-3">
                  <MessageCircle className="w-10 h-10" />
               </div>
               <h2 className="text-xl font-black text-deepIndigo mb-2">Select a Conversation</h2>
               <p className="text-sm">Choose a chat from the list to start messaging.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
