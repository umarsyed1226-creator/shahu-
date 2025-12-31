
import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { SendIcon } from '../components/icons/Icons';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await generateChatResponse(input, messages);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError('Sorry, something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg shadow-lg">
      <header className="p-4 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">AI Chatbot</h2>
        <p className="text-sm text-gray-400">Your multi-purpose AI assistant.</p>
      </header>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-200'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 p-3 rounded-lg">
                <LoadingSpinner size="h-5 w-5" />
              </div>
            </div>
          )}
          {error && <div className="text-red-400 text-center">{error}</div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="p-3 bg-cyan-600 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;
