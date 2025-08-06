import React, { useState, useRef, useEffect } from 'react';
import { track } from '@vercel/analytics';
import { XIconSVG, SendIcon, ShieldCheckIcon, LockClosedIcon, SparklesIcon } from './IconComponents';

interface EnhancedMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  resources?: Array<{
    title: string;
    description: string;
    type: 'article' | 'exercise' | 'contact';
  }>;
  suggestedActions?: string[];
  emotionalTone?: 'positive' | 'neutral' | 'distressed' | 'hopeful';
}

interface EnhancedAIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedAIChat: React.FC<EnhancedAIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize conversation when consent is given
  useEffect(() => {
    if (consentAccepted && messages.length === 0) {
      const welcomeMessage: EnhancedMessage = {
        id: `msg_${Date.now()}`,
        text: "Hello! I'm Aurora, your AI wellness companion. I'm here to provide emotional support, coping strategies, and general wellness guidance while maintaining complete privacy and HIPAA compliance. I won't ask for personal health information, and our conversation is confidential. How are you feeling today, and how can I support your wellness journey?",
        sender: 'ai',
        timestamp: new Date(),
        emotionalTone: 'hopeful'
      };
      setMessages([welcomeMessage]);
    }
  }, [consentAccepted, messages.length]);

  const addMessage = (text: string, sender: 'user' | 'ai' | 'system', resources?: any[], suggestedActions?: string[], emotionalTone?: string) => {
    const newMessage: EnhancedMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date(),
      resources,
      suggestedActions,
      emotionalTone: emotionalTone as any
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !consentAccepted) return;

    const userMessage = inputValue.trim();
    
    // Track enhanced chat usage
    if (messages.length === 1) { // Welcome message already exists
      track('enhanced_ai_chat_conversation_started', {
        session_id: sessionId,
        timestamp: new Date().toISOString()
      });
    }
    
    track('enhanced_ai_chat_message_sent', {
      session_id: sessionId,
      message_length: userMessage.length,
      message_number: messages.filter(m => m.sender === 'user').length + 1
    });
    
    setInputValue('');
    addMessage(userMessage, 'user');
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/enhanced-gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
          hipaaCompliant: true,
          context: {
            sessionId,
            messageHistory: messages.slice(-6).map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
              timestamp: msg.timestamp
            }))
          }
        }),
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setIsTyping(false);
        addMessage(
          data.data.response, 
          'ai', 
          data.data.resources,
          data.data.suggestedActions,
          data.data.emotionalTone
        );
        
        // Track response characteristics
        track('enhanced_ai_response_received', {
          session_id: sessionId,
          emotional_tone: data.data.emotionalTone,
          has_resources: data.data.resources?.length > 0,
          has_actions: data.data.suggestedActions?.length > 0
        });
      } else {
        setIsTyping(false);
        addMessage(
          "I apologize for the technical issue. For immediate assistance, please call our support line at (800) 555-0123 or speak with one of our licensed professionals.",
          'system'
        );
      }
      
    } catch (error) {
      setIsTyping(false);
      addMessage(
        "I'm having trouble connecting right now. For immediate support, please call our 24/7 helpline at (800) 555-0123.",
        'system'
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (action: string) => {
    track('suggested_action_clicked', {
      session_id: sessionId,
      action: action
    });
    // You could implement specific action handlers here
  };

  const handleResourceClick = (resource: any) => {
    track('resource_clicked', {
      session_id: sessionId,
      resource_title: resource.title,
      resource_type: resource.type
    });
    // You could open resources in new windows or modals here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border-2 border-sky-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Aurora AI Wellness Companion</h3>
              <p className="text-sky-100 text-sm">Enhanced Gemini 2.5 • HIPAA Compliant • Private & Secure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <XIconSVG className="h-6 w-6" />
          </button>
        </div>

        {/* HIPAA Consent */}
        {!consentAccepted && (
          <div className="p-8 bg-sky-50 border-b border-sky-200">
            <div className="flex items-start space-x-4">
              <ShieldCheckIcon className="h-8 w-8 text-sky-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-sky-900 mb-3">Enhanced AI Privacy & Compliance Notice</h4>
                <div className="space-y-3 text-sm text-sky-800">
                  <p>• This enhanced AI companion uses Gemini 2.5 technology for better conversations</p>
                  <p>• All conversations are HIPAA-compliant and encrypted</p>
                  <p>• I won't ask for personal health information or identifying details</p>
                  <p>• This provides general wellness support, not medical advice</p>
                  <p>• For medical concerns, please consult licensed healthcare providers</p>
                  <p>• Crisis support: Call 988 or our 24/7 line at (800) 555-0123</p>
                </div>
                <button
                  onClick={() => {
                    setConsentAccepted(true);
                    track('enhanced_ai_consent_accepted', { session_id: sessionId });
                  }}
                  className="mt-4 bg-sky-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-700 transition-colors flex items-center space-x-2"
                >
                  <LockClosedIcon className="h-4 w-4" />
                  <span>I Understand - Start Enhanced Chat</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {consentAccepted && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-sky-600 text-white rounded-2xl rounded-br-md' 
                      : message.sender === 'ai'
                      ? 'bg-white border-2 border-sky-200 text-slate-800 rounded-2xl rounded-bl-md'
                      : 'bg-amber-50 border border-amber-200 text-amber-800 rounded-xl'
                  } p-4 shadow-lg`}>
                    
                    {/* Message Text */}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    
                    {/* Emotional Tone Indicator */}
                    {message.emotionalTone && message.sender === 'ai' && (
                      <div className="mt-2 text-xs text-sky-500">
                        Tone: {message.emotionalTone}
                      </div>
                    )}
                    
                    {/* Resources */}
                    {message.resources && message.resources.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide">Recommended Resources:</p>
                        {message.resources.map((resource, index) => (
                          <button
                            key={index}
                            onClick={() => handleResourceClick(resource)}
                            className="block w-full text-left p-3 bg-sky-50 rounded-lg border border-sky-200 hover:bg-sky-100 transition-colors"
                          >
                            <div className="text-sm font-medium text-sky-800">{resource.title}</div>
                            <div className="text-xs text-sky-600 mt-1">{resource.description}</div>
                            <div className="text-xs text-sky-500 mt-1 capitalize">{resource.type}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggested Actions */}
                    {message.suggestedActions && message.suggestedActions.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-2">Try This:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestedActions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleActionClick(action)}
                              className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full hover:bg-sky-200 transition-colors"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    <div className={`text-xs mt-3 ${
                      message.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-sky-200 rounded-2xl rounded-bl-md p-4 shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-sky-200 p-6 bg-sky-50">
              <div className="flex space-x-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="flex-1 border-2 border-sky-200 rounded-full px-4 py-3 focus:outline-none focus:border-sky-500 text-slate-800"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-sky-600 text-white p-3 rounded-full hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SendIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-sky-600 mt-2 text-center">
                Powered by Enhanced Gemini 2.5 • HIPAA Compliant • Your privacy is protected
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedAIChat;
