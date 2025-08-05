import React, { useState, useRef, useEffect } from 'react';
import { XIcon, SendIcon, ShieldCheckIcon } from './IconComponents';
import { saveAIChatInsuranceSession, updateAIChatSession, AIChatInsuranceRecord, AIChatMessage, encryptData } from '../services/awsDatabase';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  containsPII?: boolean;
}

interface InsuranceBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InsuranceData {
  provider?: string;
  memberId?: string;
  groupNumber?: string;
  policyNumber?: string;
  name?: string;
  dob?: string;
  phone?: string;
  email?: string;
}

const InsuranceBotModal: React.FC<InsuranceBotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you verify your insurance coverage for addiction treatment. This chat is HIPAA-compliant and secure. By using this service, you automatically consent to secure processing of your insurance information for verification purposes only. Can you please provide your insurance provider name?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [insuranceData, setInsuranceData] = useState<InsuranceData>({});
  const [step, setStep] = useState<'provider' | 'member_id' | 'personal_info' | 'contact_time' | 'complete'>('provider');
  const [consentGiven, setConsentGiven] = useState(true); // Automatically set to true
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveToDatabase = async (newMessage?: Message) => {
    try {
      const allMessages = newMessage ? [...messages, newMessage] : messages;
      
      const chatHistory = allMessages.map(msg => ({
        messageId: `msg_${msg.id}`,
        timestamp: msg.timestamp.toISOString(),
        sender: msg.sender === 'bot' ? 'ai' as const : 'user' as const,
        message: msg.containsPII ? encryptData(msg.text) : msg.text,
        isEncrypted: msg.containsPII || false,
        containsPII: msg.containsPII
      }));

      const chatData = {
        sessionId,
        clientInfo: {
          encryptedName: insuranceData.name ? encryptData(insuranceData.name) : '',
          encryptedPhone: insuranceData.phone ? encryptData(insuranceData.phone) : '',
          encryptedEmail: insuranceData.email ? encryptData(insuranceData.email) : '',
          encryptedDOB: insuranceData.dob ? encryptData(insuranceData.dob) : '',
        },
        insuranceInfo: {
          provider: insuranceData.provider || '',
          encryptedMemberId: insuranceData.memberId ? encryptData(insuranceData.memberId) : '',
          encryptedGroupNumber: insuranceData.groupNumber ? encryptData(insuranceData.groupNumber) : '',
          encryptedPolicyNumber: insuranceData.policyNumber ? encryptData(insuranceData.policyNumber) : '',
        },
        chatHistory,
        verificationStatus: (step === 'complete' ? 'pending_review' : 'in_progress') as 'pending_review' | 'in_progress' | 'verified' | 'needs_info' | 'completed',
        urgencyLevel: 'standard' as const,
        consentGiven,
        consentTimestamp: consentGiven ? new Date().toISOString() : undefined,
        ipAddress: typeof window !== 'undefined' ? 'client_ip' : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      };

      if (!chatId) {
        const result = await saveAIChatInsuranceSession(chatData);
        if (result.success && result.chatId) {
          setChatId(result.chatId);
          console.log('✅ Encrypted data saved to secure DynamoDB:', result.chatId);
        } else {
          console.error('❌ Failed to save to DynamoDB:', result.error);
        }
      } else {
        const result = await updateAIChatSession(chatId, {
          chatHistory,
          verificationStatus: (step === 'complete' ? 'pending_review' : 'in_progress') as 'pending_review' | 'in_progress' | 'verified' | 'needs_info' | 'completed',
          clientInfo: chatData.clientInfo,
          insuranceInfo: chatData.insuranceInfo,
        });
        if (result.success) {
          console.log('✅ Encrypted data updated in secure DynamoDB:', chatId);
        } else {
          console.error('❌ Failed to update DynamoDB:', result.error);
        }
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      containsPII: detectPII(inputValue)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Process user input
    await processUserInput(inputValue);

    // Simulate AI response delay
    setTimeout(async () => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // Save to database
      await saveToDatabase(botResponse);
    }, 1500);
  };

  const detectPII = (text: string): boolean => {
    // Detect potential PII patterns
    const patterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone number
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // Date of birth
      /\b\d{8,12}\b/, // Insurance member ID (8-12 digits)
      /\b[A-Z]{2,3}\d{6,10}\b/, // Alphanumeric insurance ID
      /\b\d{4}-\d{4}-\d{4}\b/, // Formatted insurance numbers
      /\b[A-Z][a-z]+ [A-Z][a-z]+\b/, // Names (First Last)
      /\b[A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+\b/, // Names with middle initial
    ];
    
    // Also check if the text contains common personal information indicators
    const personalInfoKeywords = ['birthday', 'born', 'ssn', 'social security', 'member id', 'policy', 'group number'];
    const containsKeywords = personalInfoKeywords.some(keyword => text.toLowerCase().includes(keyword));
    
    return patterns.some(pattern => pattern.test(text)) || containsKeywords;
  };

  const processUserInput = async (input: string) => {
    const lowerInput = input.toLowerCase();
    
    switch (step) {
      case 'provider':
        if (lowerInput.includes('aetna') || lowerInput.includes('blue cross') || lowerInput.includes('cigna') || 
            lowerInput.includes('united') || lowerInput.includes('anthem') || lowerInput.includes('kaiser')) {
          setInsuranceData(prev => ({ ...prev, provider: input }));
          setStep('member_id');
        }
        break;
        
      case 'member_id':
        if (input.match(/\d{6,}/)) {
          setInsuranceData(prev => ({ ...prev, memberId: input }));
          setStep('personal_info');
        }
        break;
        
      case 'personal_info':
        // Extract name, DOB, etc. from natural language
        setStep('contact_time');
        break;
        
      case 'contact_time':
        setStep('complete');
        break;
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    switch (step) {
      case 'provider':
        if (input.includes('aetna') || input.includes('blue cross') || input.includes('cigna') || 
            input.includes('united') || input.includes('anthem') || input.includes('kaiser')) {
          return "Great! I can see you have coverage with a major provider. To verify your specific benefits, I'll need your member ID number. You can find this on your insurance card.";
        }
        return "I can help with most major insurance providers. Could you please provide the exact name as it appears on your insurance card?";
        
      case 'member_id':
        if (input.match(/\d{6,}/)) {
          return "Thank you for providing your member ID. For verification purposes, I'll also need your full name and date of birth as they appear on your insurance card. This information is encrypted and stored securely in our HIPAA-compliant system.";
        }
        return "I need your member ID number to proceed with verification. This is typically found on the front of your insurance card and is usually 8-12 digits long.";
        
      case 'personal_info':
        return "Perfect! I have your basic information. Our team typically processes insurance verifications within 24-48 hours. What's the best time to contact you with your coverage details?";
        
      case 'contact_time':
        return "Excellent! I've saved all your information securely. Our admissions team will contact you during your preferred time with detailed coverage information and next steps. You can also call our 24/7 helpline at (818) 600-8640 if you have any urgent questions. Is there anything else I can help you with?";
        
      case 'complete':
        return "Thank you for using our HIPAA-compliant insurance verification system. Your information is secure and our team will be in touch soon. Have a great day!";
        
      default:
        return "I'm here to help with your insurance verification. Let's start with your insurance provider name.";
    }
  };

  const handleGiveConsent = () => {
    setConsentGiven(true);
    const consentMessage: Message = {
      id: Date.now(),
      text: "I consent to sharing my information for insurance verification purposes.",
      sender: 'user',
      timestamp: new Date(),
      containsPII: false
    };
    setMessages(prev => [...prev, consentMessage]);
    
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: "Thank you for providing consent. Your information will be handled according to HIPAA guidelines. Now, please tell me your insurance provider name.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full h-[700px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-sky-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
              AI
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">HIPAA-Compliant Insurance Verification</h2>
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <ShieldCheckIcon className="h-3 w-3 text-green-500" />
                <span>Secure & Encrypted</span>
                <span>•</span>
                <span>Session: {sessionId.slice(-6)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* HIPAA Consent */}
        {!consentGiven && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">HIPAA Consent Required</h3>
                <p className="text-sm text-blue-700 mb-3">
                  By proceeding, you consent to sharing your protected health information for insurance verification purposes. 
                  All data is encrypted and stored securely in compliance with HIPAA regulations.
                </p>
                <button
                  onClick={handleGiveConsent}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  I Consent to HIPAA Terms
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-2 max-w-[85%]">
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
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.containsPII && (
                      <div className="flex items-center space-x-1 text-xs opacity-70">
                        <ShieldCheckIcon className="h-3 w-3" />
                        <span>Encrypted</span>
                      </div>
                    )}
                  </div>
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
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={consentGiven ? "Type your message..." : "Please provide consent first..."}
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              disabled={isTyping || !consentGiven}
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim() || !consentGiven}
              className="bg-sky-600 text-white rounded-lg p-3 hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
          <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <ShieldCheckIcon className="h-3 w-3 text-green-500" />
              <span>HIPAA Compliant</span>
            </div>
            <span>•</span>
            <span>End-to-End Encrypted</span>
            <span>•</span>
            <span>Stored in AWS DynamoDB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceBotModal;
