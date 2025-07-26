
import React, { useState, useEffect, useRef } from 'react';
import { XIcon, SendIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from './IconComponents';
import { verifyInsurance, type InsuranceVerificationData, type InsuranceVerificationResult } from '../services/geminiService';

interface InsuranceBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
    id: number;
    text: React.ReactNode;
    sender: 'bot' | 'user';
};

type Step = 'intro' | 'name' | 'dob' | 'provider' | 'policyId' | 'confirm' | 'submitting' | 'result' | 'error' | 'end';

const STEPS: Step[] = ['name', 'dob', 'provider', 'policyId', 'confirm'];
const CHAT_SESSION_KEY = 'insuranceBotSession';
const SUBMISSIONS_KEY = 'insuranceSubmissions';
const USER_HAS_VERIFIED_BEFORE_KEY = 'userHasVerifiedBefore';


const saveSubmission = (patientData: InsuranceVerificationData, verificationResult: InsuranceVerificationResult) => {
    try {
        const existingSubmissionsRaw = localStorage.getItem(SUBMISSIONS_KEY);
        const existingSubmissions = existingSubmissionsRaw ? JSON.parse(existingSubmissionsRaw) : [];
        const newSubmission = {
            submissionId: Date.now(),
            submittedAt: new Date().toISOString(),
            patientData,
            verificationResult,
        };
        const updatedSubmissions = [...existingSubmissions, newSubmission];
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
    } catch (error) {
        console.error("Failed to save submission to localStorage:", error);
    }
};

export const InsuranceBotModal: React.FC<InsuranceBotModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [step, setStep] = useState<Step>('intro');
    const [userData, setUserData] = useState<Partial<InsuranceVerificationData>>({});
    const [inputValue, setInputValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationResult, setVerificationResult] = useState<InsuranceVerificationResult | null>(null);
    const [apiError, setApiError] = useState('');
    
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const addMessage = (text: React.ReactNode, sender: 'bot' | 'user') => {
        setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
    };
    
    const resetAndInitialize = (isRestart = false) => {
        let initialText;
        if (isRestart) {
            initialText = "Let's start over. To get started, what is your full name?";
        } else {
            const hasVerifiedBefore = localStorage.getItem(USER_HAS_VERIFIED_BEFORE_KEY) === 'true';
            initialText = hasVerifiedBefore
                ? "Welcome back! Let's start a new insurance verification. To begin, what is your full name?"
                : "Hello! I'm an AI assistant. I can help you verify your insurance coverage in just a few steps. To get started, what is your full name?";
        }
        
        setMessages([{ id: Date.now(), text: initialText, sender: 'bot' }]);
        setStep('name');
        setUserData({});
        setInputValue('');
        setIsSubmitting(false);
        setVerificationResult(null);
        setApiError('');
        localStorage.removeItem(CHAT_SESSION_KEY);
    };

    // Load/initialize state when modal is opened
    useEffect(() => {
        if (isOpen) {
            try {
                const savedSession = localStorage.getItem(CHAT_SESSION_KEY);
                if (savedSession) {
                    const { messages, step, userData } = JSON.parse(savedSession);
                    setMessages(messages);
                    setStep(step);
                    setUserData(userData);
                } else {
                    resetAndInitialize();
                }
            } catch (e) {
                console.error("Failed to load chat session:", e);
                resetAndInitialize();
            }
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [isOpen]);

    // Save state to localStorage on change
    useEffect(() => {
        if (isOpen && step !== 'intro' && step !== 'end' && step !== 'result' && step !== 'error') {
            localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify({ messages, step, userData }));
        }
    }, [messages, step, userData, isOpen]);

    // Main conversation logic
    useEffect(() => {
        const botPrompts = {
            name: "To get started, what is your full name?",
            dob: `Thanks, ${userData.name}. What is your date of birth? (e.g., MM/DD/YYYY)`,
            provider: "Great. Which insurance provider do you have? (e.g., Aetna, Blue Cross)",
            policyId: "Almost there. What is your Policy or Member ID?",
            confirm: () => (
                <div>
                    <p>Perfect. Please review your information:</p>
                    <ul className="list-disc list-inside my-2 text-sm">
                        <li><strong>Name:</strong> {userData.name}</li>
                        <li><strong>Date of Birth:</strong> {userData.dob}</li>
                        <li><strong>Provider:</strong> {userData.provider}</li>
                        <li><strong>Policy ID:</strong> {userData.policyId}</li>
                    </ul>
                    <p>Is this all correct? (Yes/No)</p>
                </div>
            ),
            submitting: "Thank you. Verifying your benefits now, please wait a moment...",
            end: "I'm glad I could assist you. A member of our team will be in touch shortly based on the next steps provided. You can now close this window."
        };

        if (step in botPrompts && step !== 'intro') {
             // Only add the prompt if the last message was from the user, to avoid double-posting
            if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
                const prompt = botPrompts[step as keyof typeof botPrompts];
                if (typeof prompt === 'function') {
                    addMessage(prompt(), 'bot');
                } else {
                    addMessage(prompt, 'bot');
                }
            }
        }
        
        scrollToBottom();
    }, [step, userData.name, messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        addMessage(userMessage, 'user');
        setInputValue('');

        if (step === 'confirm') {
            if (userMessage.toLowerCase().startsWith('y')) {
                setStep('submitting');
                setIsSubmitting(true);
                try {
                    const result = await verifyInsurance(userData as InsuranceVerificationData);
                    setVerificationResult(result);
                    // Save successful submission
                    saveSubmission(userData as InsuranceVerificationData, result);
                    setStep('result');
                } catch (error) {
                    setApiError("We encountered a problem verifying your insurance. Please double-check your information or contact our admissions team directly by phone.");
                    setStep('error');
                } finally {
                    setIsSubmitting(false);
                }
            } else {
                resetAndInitialize(true);
            }
        } else {
            const currentStepIndex = STEPS.indexOf(step);
            setUserData(prev => ({...prev, [step]: userMessage}));
            setStep(STEPS[currentStepIndex + 1]);
        }
    };
    
    useEffect(() => {
        if (step === 'result' && verificationResult) {
            const { status, planName, coverageSummary, nextSteps } = verificationResult;
            let IconComponent, iconColor, title;
            switch (status) {
                case 'Verified': IconComponent = CheckCircleIcon; iconColor = 'text-green-500'; title = 'Benefits Verified'; break;
                case 'Review Needed': IconComponent = ExclamationCircleIcon; iconColor = 'text-amber-500'; title = 'Review Needed'; break;
                default: IconComponent = XCircleIcon; iconColor = 'text-red-500'; title = 'Plan Not Found'; break;
            }
            const resultMessage = (
                <div className="p-4 rounded-lg bg-slate-100/70 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-left">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-600 pb-3 mb-3">
                      <IconComponent className={`h-8 w-8 flex-shrink-0 ${iconColor}`} />
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
                    </div>
                    <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                        <p><strong className="text-slate-600 dark:text-slate-200">Plan Name:</strong> {planName}</p>
                        <p><strong className="text-slate-600 dark:text-slate-200">Coverage Summary:</strong> {coverageSummary}</p>
                        <p className="font-semibold text-slate-800 dark:text-white pt-2 border-t border-slate-200/80 dark:border-slate-600/80"><strong className="text-slate-600 dark:text-slate-200">Next Steps:</strong> {nextSteps}</p>
                    </div>
                </div>
            );
            addMessage(resultMessage, 'bot');
            const endMessage = (
                <div>
                  <p>Our team will be in touch. You can close this window now.</p>
                  <button onClick={() => resetAndInitialize(true)} className="mt-2 font-semibold text-sky-600 dark:text-sky-400 underline hover:text-sky-500 dark:hover:text-sky-300">Start New Verification</button>
                </div>
            );
            addMessage(endMessage, 'bot');
            localStorage.removeItem(CHAT_SESSION_KEY);
            localStorage.setItem(USER_HAS_VERIFIED_BEFORE_KEY, 'true');
            setStep('end');

        } else if (step === 'error') {
            const errorMessage = (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30">
                    <div className="flex items-center gap-3">
                        <XCircleIcon className="h-8 w-8 text-red-500 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-red-800 dark:text-red-200">Verification Failed</h3>
                            <p className="text-red-700 dark:text-red-300 text-sm">{apiError}</p>
                        </div>
                    </div>
                </div>
            );
            addMessage(errorMessage, 'bot');
            const restartMessage = (
              <div>Would you like to <button onClick={() => resetAndInitialize(true)} className="font-bold text-sky-600 dark:text-sky-400 underline hover:text-sky-500 dark:hover:text-sky-300">try again</button>?</div>
            );
            addMessage(restartMessage, 'bot');
            localStorage.removeItem(CHAT_SESSION_KEY);
        }
        scrollToBottom();
    }, [step, verificationResult, apiError]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="bot-title">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] sm:h-[70vh] flex flex-col transform animate-slide-up" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-slate-700/80 flex-shrink-0">
                    <h3 id="bot-title" className="text-xl font-bold text-slate-800 dark:text-white">AI Insurance Assistant</h3>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300">
                        <span className="sr-only">Close</span>
                        <XIcon className="h-6 w-6" />
                    </button>
                </header>
                
                {/* Chat Area */}
                <div className="flex-grow p-4 space-y-4 overflow-y-auto" role="log">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">AI</div>}
                            <div className={`max-w-[80%] p-3 rounded-2xl text-base ${msg.sender === 'bot' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100 rounded-bl-none' : 'bg-sky-600 text-white rounded-br-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                
                {/* Input Area */}
                <footer className="p-4 border-t border-slate-200/80 dark:border-slate-700/80 flex-shrink-0">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={isSubmitting || step === 'end' ? "Please wait..." : "Type your message..."}
                            disabled={isSubmitting || step === 'end' || step === 'result' || step === 'submitting' || step === 'error'}
                            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 dark:placeholder:text-slate-400"
                            aria-label="Your message"
                        />
                        <button type="submit" disabled={isSubmitting || step === 'end' || step === 'result' || step === 'submitting' || step === 'error' || !inputValue.trim()} className="bg-sky-600 text-white rounded-full p-3 hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                            <SendIcon className="h-6 w-6" />
                            <span className="sr-only">Send</span>
                        </button>
                    </form>
                </footer>
            </div>
             <style>{`
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
                @media (min-width: 640px) {
                    @keyframes slide-up { from { opacity: 0; transform: scale(.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                }
                .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default InsuranceBotModal;
