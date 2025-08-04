import React, { useState, useEffect, useRef } from 'react';
import { XIcon, SendIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, ShieldCheckIcon } from './IconComponents';
import { secureInsuranceService, type SecureInsuranceVerificationResult } from '../services/secureInsuranceService';
import HIPAAConsent from './HIPAAConsent';

interface SecureInsuranceBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
    id: number;
    text: React.ReactNode;
    sender: 'bot' | 'user';
};

type Step = 'intro' | 'hipaa-consent' | 'name' | 'dob' | 'provider' | 'policyId' | 'confirm' | 'submitting' | 'result' | 'error' | 'end';

interface PatientData {
  name: string;
  dob: string;
  provider: string;
  policyId: string;
}

export const SecureInsuranceBotModal: React.FC<SecureInsuranceBotModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [step, setStep] = useState<Step>('intro');
    const [userData, setUserData] = useState<Partial<PatientData>>({});
    const [inputValue, setInputValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationResult, setVerificationResult] = useState<SecureInsuranceVerificationResult | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    
    // Log state for development debugging
    useEffect(() => {
        if (verificationResult) console.log('Verification completed:', verificationResult.verificationStatus);
        if (sessionExpired) console.log('Session expired, requiring restart');
    }, [verificationResult, sessionExpired]);
    const [hipaaConsentGiven, setHipaaConsentGiven] = useState(false);
    
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const addMessage = (text: React.ReactNode, sender: 'bot' | 'user') => {
        setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
    };
    
    const resetAndInitialize = () => {
        const initialText = (
            <div>
                <div className="flex items-center mb-3">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-semibold">Secure Insurance Verification</span>
                </div>
                <p>Hello! I'm your secure insurance verification assistant. I can help you verify your insurance coverage for our treatment programs.</p>
                <p className="mt-2 text-sm text-gray-600 
                    <strong>Privacy Notice:</strong> All information is transmitted securely and encrypted. We comply with HIPAA regulations to protect your health information.
                </p>
                <p className="mt-2">To begin, I'll need your consent to process your health information.</p>
            </div>
        );
        
        setMessages([{ id: Date.now(), text: initialText, sender: 'bot' }]);
        setStep('hipaa-consent');
        setUserData({});
        setInputValue('');
        setIsSubmitting(false);
        setVerificationResult(null);
        setSessionExpired(false);
        setHipaaConsentGiven(false);
    };

    // Initialize session when modal opens
    useEffect(() => {
        if (isOpen) {
            resetAndInitialize();
            // Initialize secure session with backend
            secureInsuranceService.initializeSession().catch(error => {
                console.error('Failed to initialize secure session:', error);
                addMessage('Unable to establish secure connection. Please try again later.', 'bot');
                setStep('error');
            });
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [isOpen]);

    // Cleanup session when modal closes
    useEffect(() => {
        if (!isOpen) {
            secureInsuranceService.cleanupSession();
        }
    }, [isOpen]);

    // Main conversation logic
    useEffect(() => {
        const botPrompts = {
            name: "Thank you for your consent. To get started, what is your full name?",
            dob: `Thanks, ${userData.name}. What is your date of birth? (MM/DD/YYYY format)`,
            provider: "What is the name of your insurance provider? (e.g., Aetna, Blue Cross Blue Shield, Cigna)",
            policyId: "What is your Policy ID or Member ID number?",
            confirm: () => (
                <div className="space-y-3">
                    <p>Please review your information before we submit for verification:</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div><strong>Name:</strong> {userData.name}</div>
                            <div><strong>Date of Birth:</strong> {userData.dob}</div>
                            <div><strong>Insurance Provider:</strong> {userData.provider}</div>
                            <div><strong>Policy ID:</strong> {userData.policyId}</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 
                        This information will be securely transmitted to verify your benefits. Type "confirm" to proceed or "edit" to make changes.
                    </p>
                </div>
            ),
            submitting: "Securely verifying your benefits with your insurance provider. This may take a moment...",
            end: "Thank you for using our secure verification system. A member of our admissions team will contact you shortly with next steps. This window will automatically close in 30 seconds."
        };

        if (step in botPrompts && step !== 'intro' && step !== 'hipaa-consent') {
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

    const handleHIPAAConsent = (consentGiven: boolean) => {
        if (consentGiven) {
            setHipaaConsentGiven(true);
            addMessage("I consent to the use of my health information for insurance verification.", 'user');
            setStep('name');
        } else {
            addMessage("I do not consent to the use of my health information.", 'user');
            addMessage("I understand. Without consent, we cannot proceed with insurance verification. You may still contact our admissions team directly at (800) 555-0123 for assistance.", 'bot');
            setTimeout(() => onClose(), 3000);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        addMessage(userMessage, 'user');
        setInputValue('');

        // Handle different steps
        switch (step) {
            case 'name':
                if (userMessage.length < 2) {
                    addMessage("Please provide your full name.", 'bot');
                    return;
                }
                setUserData(prev => ({ ...prev, name: userMessage }));
                setStep('dob');
                break;

            case 'dob':
                const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
                if (!dobRegex.test(userMessage)) {
                    addMessage("Please provide your date of birth in MM/DD/YYYY format.", 'bot');
                    return;
                }
                setUserData(prev => ({ ...prev, dob: userMessage }));
                setStep('provider');
                break;

            case 'provider':
                if (userMessage.length < 2) {
                    addMessage("Please provide your insurance provider name.", 'bot');
                    return;
                }
                setUserData(prev => ({ ...prev, provider: userMessage }));
                setStep('policyId');
                break;

            case 'policyId':
                if (userMessage.length < 3) {
                    addMessage("Please provide a valid Policy ID or Member ID.", 'bot');
                    return;
                }
                setUserData(prev => ({ ...prev, policyId: userMessage }));
                setStep('confirm');
                break;

            case 'confirm':
                if (userMessage.toLowerCase().includes('confirm') || userMessage.toLowerCase().includes('yes')) {
                    await handleSubmitVerification();
                } else if (userMessage.toLowerCase().includes('edit') || userMessage.toLowerCase().includes('change')) {
                    addMessage("Which information would you like to change? Say 'name', 'dob', 'provider', or 'policy' to update that field.", 'bot');
                    return;
                } else {
                    addMessage("Please type 'confirm' to proceed with verification or 'edit' to make changes.", 'bot');
                    return;
                }
                break;

            case 'result':
                // Allow user to ask follow-up questions about results
                addMessage("Thank you for your question. Our admissions team will provide detailed information when they contact you.", 'bot');
                break;

            default:
                addMessage("I didn't understand that. Please follow the prompts above.", 'bot');
        }
    };

    const handleSubmitVerification = async () => {
        setStep('submitting');
        setIsSubmitting(true);

        try {
            if (!userData.name || !userData.dob || !userData.provider || !userData.policyId) {
                throw new Error('Missing required patient information');
            }

            const result = await secureInsuranceService.verifyInsurance(
                userData as PatientData,
                hipaaConsentGiven
            );

            setVerificationResult(result);
            setStep('result');

            // Display results
            const resultMessage = (
                <div className="space-y-3">
                    <div className="flex items-center">
                        {result.verificationStatus === 'verified' ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        ) : result.verificationStatus === 'pending' ? (
                            <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="font-semibold">
                            Verification {result.verificationStatus === 'verified' ? 'Complete' : 
                                      result.verificationStatus === 'pending' ? 'Pending' : 'Unable to Verify'}
                        </span>
                    </div>
                    
                    {result.coverageDetails && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Coverage Details:</h4>
                            <div className="text-sm space-y-1">
                                <div><strong>Plan:</strong> {result.coverageDetails.planName}</div>
                                <div><strong>Estimated Coverage:</strong> {result.coverageDetails.estimatedCoverage}</div>
                                <div><strong>Deductible:</strong> {result.coverageDetails.deductible}</div>
                                {result.coverageDetails.priorAuthRequired && (
                                    <div className="text-yellow-600 
                                        <strong>Note:</strong> Prior authorization may be required
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Next Steps:</h4>
                        <ul className="text-sm list-disc list-inside space-y-1">
                            {result.nextSteps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-xs text-gray-500 
                        Reference #: {result.referenceNumber}
                    </div>
                </div>
            );

            addMessage(resultMessage, 'bot');
            
            // Auto-close after showing results
            setTimeout(() => {
                setStep('end');
                setTimeout(() => onClose(), 30000); // Auto-close after 30 seconds
            }, 2000);

        } catch (error: any) {
            console.error('Verification error:', error);
            setStep('error');
            
            if (error.message.includes('Session expired')) {
                setSessionExpired(true);
                addMessage("Your secure session has expired for security reasons. Please restart the verification process.", 'bot');
            } else {
                addMessage(`Verification failed: ${error.message}. Please try again or contact our admissions team at (800) 555-0123.`, 'bot');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 
                    <div className="flex items-center">
                        <ShieldCheckIcon className="h-6 w-6 text-blue-500 mr-2" />
                        <h2 className="text-xl font-bold text-slate-800 
                            Secure Insurance Verification
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${
                                message.sender === 'user' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-slate-100 text-slate-800 
                            }`}>
                                {message.text}
                            </div>
                        </div>
                    ))}

                    {/* HIPAA Consent Component */}
                    {step === 'hipaa-consent' && (
                        <HIPAAConsent 
                            onConsentGiven={handleHIPAAConsent}
                            patientName={userData.name}
                        />
                    )}

                    {/* Loading indicator */}
                    {isSubmitting && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 p-3 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                    <span className="text-slate-600 securely...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area - only show when appropriate */}
                {!['intro', 'hipaa-consent', 'submitting', 'end'].includes(step) && (
                    <div className="p-6 border-t border-slate-200 
                        <div className="flex space-x-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your response..."
                                className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                disabled={isSubmitting}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isSubmitting}
                                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <SendIcon className="h-5 w-5" />
                            </button>
                        </div>
                        
                        {/* Security notice */}
                        <div className="mt-3 text-xs text-gray-500 flex items-center">
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            Your information is encrypted and secure
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecureInsuranceBotModal;
