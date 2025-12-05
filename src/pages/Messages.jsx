import React, { useState } from 'react';
// PageTransition intentionally omitted for Messages to avoid animated entry
import { Card, Button } from '../components/common';
import { Search, Send, Plus, Paperclip } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const mockConversations = [
  { id: 'c1', name: 'Amit Sharma', last: 'Can you update the spec?', time: '2h', unread: 2, avatar: '' },
  { id: 'c2', name: 'Riya Patel', last: "Looks great — I'll review today.", time: '1d', unread: 0, avatar: '' },
  { id: 'c3', name: 'Vikas Kumar', last: 'Sent you the files', time: '3d', unread: 0, avatar: '' },
];

const mockMessages = {
  c1: [
    { id: 'm1', fromMe: false, text: 'Hi — are you available to start next week?', time: '10:02' },
    { id: 'm2', fromMe: true, text: 'Yes, I can start on Monday.', time: '10:10' },
    { id: 'm3', fromMe: false, text: 'Perfect — I will share the brief.', time: '10:12' },
  ],
  c2: [
    { id: 'm4', fromMe: false, text: 'Please check the design updates.', time: '11:00' },
  ],
  c3: [
    { id: 'm5', fromMe: true, text: 'Thanks — received the files.', time: '09:30' },
  ],
};

const Messages = () => {
  const { userProfile } = useAuth();
  const [selected, setSelected] = useState(mockConversations[0].id);
  const [text, setText] = useState('');

  const convs = mockConversations;
  const messages = mockMessages[selected] || [];

  const handleSend = () => {
    if (!text.trim()) return;
    // append to mockMessages locally (not persisted)
    messages.push({ id: `m${Date.now()}`, fromMe: true, text: text.trim(), time: 'Now' });
    setText('');
  };

  return (
    <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mt-20 ">
          <header className="mt-20 mb-6 flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-600 mt-1">Your conversations with clients and collaborators.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card hover={false} className="p-4" style={{ transition: 'none' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <input className="w-full px-3 py-2 rounded-md border bg-white text-sm" placeholder="Search conversations" />
                    <div className="absolute right-2 top-2 text-gray-400"><Search size={16} /></div>
                  </div>
                  <Button variant="ghost"><Plus size={16} /></Button>
                </div>

                <div className="space-y-2">
                  {convs.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c.id)}
                      className={`w-full text-left p-3 rounded-md flex items-center gap-3 ${selected === c.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-11 h-11 rounded-md bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">{c.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">{c.name}</div>
                          <div className="text-xs text-gray-400">{c.time}</div>
                        </div>
                        <div className="text-sm text-gray-600 truncate">{c.last}</div>
                      </div>
                      {c.unread > 0 && <div className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">{c.unread}</div>}
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="md:col-span-2 flex flex-col">
              <Card hover={false} className="flex-1 flex flex-col p-4" style={{ transition: 'none' }}>
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-md bg-gray-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">{convs.find(c => c.id === selected)?.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{convs.find(c => c.id === selected)?.name}</div>
                      <div className="text-xs text-gray-500">Active now</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost">Files</Button>
                    <Button variant="ghost">Call</Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 px-2">
                  {messages.map((m) => (
                    <div key={m.id} className={`max-w-3/4 ${m.fromMe ? 'ml-auto text-right' : ''}`}>
                      <div className={`${m.fromMe ? 'inline-block bg-primary-600 text-white' : 'inline-block bg-gray-100 text-gray-900'} px-4 py-2 rounded-md`}>{m.text}</div>
                      <div className="text-xs text-gray-400 mt-1">{m.time}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 px-3 py-2 rounded-md border bg-white text-sm"
                    />
                    <button className="p-2 text-gray-600 hover:text-gray-900" title="Attach"><Paperclip size={18} /></button>
                    <Button onClick={handleSend}><Send size={16} /></Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
  );
};

export default Messages;
