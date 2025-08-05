import React, { useState, useRef, useEffect } from 'react';
import { XIcon, SendIcon } from './IconComponents';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface InsuranceBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InsuranceBotModal: React.FC<InsuranceBotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you verify your insurance coverage for addiction treatment. Can you please provide your insurance provider name?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('aetna') || input.includes('blue cross') || input.includes('cigna') || input.includes('united') || input.includes('anthem')) {
      return "Great! I can see that you have coverage with a major provider. Based on your insurance, you may have coverage for outpatient addiction treatment. Would you like me to verify your specific benefits? I'll need your member ID and date of birth.";
    }
    
    if (input.includes('member') || input.includes('id') || input.match(/\d{8,}/)) {
      return "Thank you for providing that information. I'm processing your insurance verification now. This typically takes 24-48 hours. Our admissions team will contact you directly with your coverage details and next steps. Is there a preferred time to reach you?";
    }
    
    if (input.includes('morning') || input.includes('afternoon') || input.includes('evening')) {
      return "Perfect! We'll contact you during that time. In the meantime, you can reach our 24/7 helpline at (818) 600-8640 if you have any urgent questions. Is there anything else I can help you with regarding your treatment options?";
    }
    
    return "I understand. Our team is here to help guide you through the insurance verification process. Would you like to speak with a live representative, or do you have other questions about our treatment programs?";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Insurance Verification</h2>
              <p className="text-xs text-slate-500">Powered by AI • Secure & Confidential</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-2 max-w-[80%]">
                {message.sender === 'bot' && (
                  <div className="h-6 w-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === 'bot'
                      ? 'bg-slate-100 text-slate-800 rounded-bl-none'
                      : 'bg-sky-600 text-white rounded-br-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="h-6 w-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div className="bg-slate-100 p-3 rounded-2xl rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="bg-sky-600 text-white rounded-lg p-3 hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-2 text-center">
            🔒 Your information is secure and confidential
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceBotModal;
