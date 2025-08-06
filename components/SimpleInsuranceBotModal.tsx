import React, { useState, useRef, useEffect } from 'react';
import { track } from '@vercel/analytics';
import { XIcon, SendIcon, ShieldCheckIcon } from './IconComponents';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  insuranceCarrier: string;
  insuranceId: string;
  groupNumber: string;
  carrierPhone: string;
  situation: string;
}

interface SimpleInsuranceBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleInsuranceBotModal: React.FC<SimpleInsuranceBotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you with your insurance verification for addiction treatment. I'll need to collect some information from you. Let's start with your first name.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<'firstName' | 'lastName' | 'phone' | 'email' | 'dateOfBirth' | 'insuranceCarrier' | 'insuranceId' | 'groupNumber' | 'carrierPhone' | 'situation' | 'complete'>('firstName');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    insuranceCarrier: '',
    insuranceId: '',
    groupNumber: '',
    carrierPhone: '',
    situation: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (response: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(response, 'bot');
    }, 1500);
  };

  const getBotResponse = (input: string): string => {
    const trimmedInput = input.trim();
    
    switch (step) {
      case 'firstName':
        setUserInfo(prev => ({ ...prev, firstName: trimmedInput }));
        setStep('lastName');
        return `Thank you, ${trimmedInput}! Now, what's your last name?`;
      
      case 'lastName':
        setUserInfo(prev => ({ ...prev, lastName: trimmedInput }));
        setStep('phone');
        return "Great! What's your phone number?";
      
      case 'phone':
        setUserInfo(prev => ({ ...prev, phone: trimmedInput }));
        setStep('email');
        return "Perfect! What's your email address?";
      
      case 'email':
        setUserInfo(prev => ({ ...prev, email: trimmedInput }));
        setStep('dateOfBirth');
        return "Thanks! What's your date of birth? Please use the format MM/DD/YYYY.";
      
      case 'dateOfBirth':
        setUserInfo(prev => ({ ...prev, dateOfBirth: trimmedInput }));
        setStep('insuranceCarrier');
        return "Got it! What's your health insurance carrier? (e.g., Blue Cross Blue Shield, Aetna, Cigna, etc.)";
      
      case 'insuranceCarrier':
        setUserInfo(prev => ({ ...prev, insuranceCarrier: trimmedInput }));
        setStep('insuranceId');
        return "Thank you! What's your Insurance ID Number? This is usually found on your insurance card.";
      
      case 'insuranceId':
        setUserInfo(prev => ({ ...prev, insuranceId: trimmedInput }));
        setStep('groupNumber');
        return "Perfect! What's your Group Number? This should also be on your insurance card.";
      
      case 'groupNumber':
        setUserInfo(prev => ({ ...prev, groupNumber: trimmedInput }));
        setStep('carrierPhone');
        return "Great! What's your Insurance Carrier Phone number?";
      
      case 'carrierPhone':
        setUserInfo(prev => ({ ...prev, carrierPhone: trimmedInput }));
        setStep('situation');
        return "Almost done! Can you describe your situation? This will help us better understand how to assist you.";
      
      case 'situation':
        setUserInfo(prev => ({ ...prev, situation: trimmedInput }));
        setStep('complete');
        // Track insurance form completion
        track('insurance_form_completed', {
          location: 'insurance_modal',
          form_type: 'full_insurance_verification',
          has_insurance: userInfo.insuranceCarrier ? 'yes' : 'no'
        });
        return "Thank you for providing all that information! We have everything we need to verify your insurance coverage. A member of our admissions team will contact you within 24 hours to discuss your benefits and help you get started with treatment. Is there anything else you'd like to know about our programs?";
      
      case 'complete':
        return "We'll be in touch soon! If you have any urgent questions, please call our 24/7 helpline at (800) 555-0123. Take care!";
      
      default:
        return "I'm here to help with your insurance verification. Let's start with your first name.";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    const response = getBotResponse(inputValue);
    setInputValue('');
    simulateTyping(response);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-sky-600 mr-2" />
            <h2 className="text-lg font-bold text-slate-800">Insurance Coverage Check</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-2 max-w-[85%]">
                {message.sender === 'bot' && (
                  <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
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
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[85%]">
                <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  AI
                </div>
                <div className="bg-slate-100 text-slate-800 p-3 rounded-2xl rounded-bl-none">
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
        <div className="border-t border-slate-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isTyping}
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-sky-600 text-white p-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-2 text-center">
            This chat helps check insurance coverage. For immediate help, call (800) 555-0123
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleInsuranceBotModal;
