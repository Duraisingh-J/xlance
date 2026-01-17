// src/pages/Messages.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Button } from '../components/common';
import { Search, Send, Plus, Paperclip, Smile, ArrowLeft, Phone, Video, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messageService';

const Messages = () => {
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const [selectedConvId, setSelectedConvId] = useState(location.state?.conversationId || null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const fileRef = useRef(null);

  // 1. Subscribe to Conversations List
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = messageService.subscribeToConversations(user.uid, (data) => {
      // Map Firestore data to UI format
      const formatted = data.map(conv => {
        // Find the 'other' participant
        const otherId = conv.participants.find(p => p !== user.uid);
        const details = conv.participantDetails?.[otherId] || { name: 'User', avatar: '' };

        return {
          id: conv.id,
          otherId,
          name: details.name,
          avatar: details.avatar,
          lastMessage: conv.lastMessage || 'No messages yet',
          time: conv.lastMessageTime?.toDate ? conv.lastMessageTime.toDate().toLocaleDateString() : '',
          unread: conv.unreadCounts?.[user.uid] || 0,
          updatedAt: conv.updatedAt
        };
      });
      setConversations(formatted);
      setLoadingConvs(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Subscribe to Messages for Selected Conversation
  useEffect(() => {
    if (!selectedConvId) {
      setMessages([]);
      return;
    }

    // Mark as read when opening (simple version)
    if (user?.uid) {
      messageService.markAsRead(selectedConvId, user.uid).catch(console.error);
    }

    const unsubscribe = messageService.subscribeToMessages(selectedConvId, (data) => {
      const formatted = data.map(m => ({
        id: m.id,
        text: m.text,
        fromMe: m.senderId === user.uid,
        time: m.createdAt ? m.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...',
        date: m.createdAt
      }));
      setMessages(formatted);
    });

    return () => unsubscribe();
  }, [selectedConvId, user]);


  // Layout & Resizing Logic (Desktop)
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const [leftWidth, setLeftWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!isResizing) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = clientX - startXRef.current;
      const containerWidth = containerRef.current ? containerRef.current.getBoundingClientRect().width : window.innerWidth;
      const maxLeft = Math.max(240, Math.min(800, containerWidth - 240));
      setLeftWidth(Math.max(220, Math.min(maxLeft, startWidthRef.current + delta)));
    };
    const onUp = () => setIsResizing(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizing]);

  const startResize = (clientX) => {
    startXRef.current = clientX;
    startWidthRef.current = leftWidth;
    setIsResizing(true);
  };

  const initials = (name = '') => name.slice(0, 2).toUpperCase();

  const handleSend = async () => {
    if (!text.trim() || !selectedConvId || !user) return;
    const msgText = text.trim();
    setText(''); // Optimistic clear

    try {
      await messageService.sendMessage(selectedConvId, user.uid, msgText);
    } catch (error) {
      console.error("Failed to send message:", error);
      setText(msgText); // Restore on error
    }
  };

  const activeConv = conversations.find(c => c.id === selectedConvId);

  return (
    <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 h-screen overflow-hidden flex flex-col">
      {/* Explicit Height Container for Chat Layout */}
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 h-full min-h-0">

        {/* Header */}
        <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
            <p className="text-sm text-gray-600 mt-1">Chat securely with your clients.</p>
          </div>
        </header>

        {/* Main layout: resizable two-column on md+, stacked on mobile */}
        <div ref={containerRef} className="flex flex-col md:flex-row gap-0 flex-1 min-h-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Conversations list */}
          <div className={`flex flex-col min-h-0 ${selectedConvId ? 'hidden md:flex' : 'flex'}`} style={{ ...(isDesktop ? { width: leftWidth } : { width: '100%' }) }}>

            {/* Search header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <input
                  className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary-300 transition-colors"
                  placeholder="Search conversations..."
                />
                <div className="absolute right-3 top-3 text-gray-400"><Search size={18} /></div>
              </div>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {loadingConvs ? (
                <div className="p-4 text-center text-gray-400 text-sm">Loading chats...</div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-400">
                  <MessageSquare size={48} className="mb-2 opacity-20" />
                  <p>No conversations yet.</p>
                </div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConvId(c.id)}
                    className={`w-full text-left py-4 px-4 flex items-center gap-3 border-b border-gray-50 hover:bg-gray-50 transition-all ${selectedConvId === c.id ? 'bg-primary-50 hover:bg-primary-50' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0">
                      {initials(c.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold truncate ${selectedConvId === c.id ? 'text-primary-900' : 'text-gray-900'}`}>{c.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{c.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate max-w-[180px] ${c.unread > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                          {c.lastMessage}
                        </p>
                        {c.unread > 0 && (
                          <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-sm">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Resizer Handle */}
          <div
            className="hidden md:flex w-1 hover:w-1.5 bg-gray-100 hover:bg-primary-200 cursor-col-resize transition-all z-10"
            onMouseDown={(e) => { if (isDesktop) startResize(e.clientX); }}
          />

          {/* Chat Window */}
          <div className={`flex-1 flex flex-col min-h-0 bg-[#F3F4F6] relative ${selectedConvId ? 'flex' : 'hidden md:flex'}`}>
            {!selectedConvId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F8FAFC]">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare size={40} className="text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
                <p className="text-gray-500 max-w-sm">Select a conversation from the sidebar to start chatting securely with your clients.</p>
              </div>
            ) : (
              <>
                {/* Chat Top Bar */}
                <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
                  <div className="flex items-center gap-3">
                    <button className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full" onClick={() => setSelectedConvId(null)}>
                      <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      {initials(activeConv?.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{activeConv?.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"><Phone size={20} /></button>
                    <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"><Video size={20} /></button>
                  </div>
                </div>

                {/* Messages Area - with ref for auto-scroll */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {messages.map((msg, index) => (
                    <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-5 py-3 shadow-sm text-sm relative group ${msg.fromMe
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                        }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <span className={`text-[10px] block text-right mt-1 opacity-70 ${msg.fromMe ? 'text-primary-100' : 'text-gray-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  {/* Invisible element to auto-scroll to */}
                  <div className="h-0" ref={el => el?.scrollIntoView({ behavior: 'smooth' })} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                      <Plus size={20} />
                    </button>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 max-h-32 text-sm text-gray-900 placeholder:text-gray-400"
                      rows={1}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!text.trim()}
                      className="p-2.5 bg-primary-600 text-white rounded-xl shadow-md hover:bg-primary-700 disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </main>
  );
};

export default Messages;
