import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { callGemini } from '../utils/gemini';
const AIReferee = ({ siteConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Referee. Ask me anything about Technoxian rules, arena dimensions, or scoring criteria.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const systemPrompt = `You are an expert AI Referee for the Technoxian World Robotics Championship.
    Answer questions about rules for games like Robo Race, Robo Soccer, Drone Racing, Sumo Bot, etc.
    Be concise, professional, and authoritative but helpful.
    Current Context: The user is asking about: "${userMsg}"`;

    const aiResponse = await callGemini(systemPrompt);
    setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 ${siteConfig.colors.primary} text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2`}
      >
        <Bot size={24} />
        <span className="font-bold text-sm hidden md:inline">Ask AI Referee</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fadeIn">
          <div className={`${siteConfig.colors.primary} p-4 flex justify-between items-center text-white`}>
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">AI Referee Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X size={18} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about rules..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIReferee;

