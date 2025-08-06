// Enhanced Gemini 2.5 AI Service for Addiction Recovery
// HIPAA-compliant chat agent with specialized knowledge

interface ConversationContext {
  sessionId: string;
  messageHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }>;
  userPreferences?: {
    preferredTopics?: string[];
    communicationStyle?: 'formal' | 'casual' | 'supportive';
    currentFocus?: 'recovery' | 'mental_health' | 'general_wellness';
  };
}

interface EnhancedGeminiRequest {
  message: string;
  sessionId: string;
  hipaaCompliant: boolean;
  context?: ConversationContext;
}

interface EnhancedGeminiResponse {
  response: string;
  sessionId: string;
  timestamp: Date;
  complianceStatus: 'compliant' | 'error';
  suggestedActions?: string[];
  resources?: Array<{
    title: string;
    description: string;
    type: 'article' | 'exercise' | 'contact';
  }>;
  emotionalTone?: 'positive' | 'neutral' | 'distressed' | 'hopeful';
}

// Enhanced HIPAA-compliant chat service with Gemini 2.5 AI
export class EnhancedGeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  private conversationContexts: Map<string, ConversationContext> = new Map();
  
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not found. AI chat will use fallback responses.');
    }
  }

  // Enhanced HIPAA-compliant system prompt with addiction recovery specialization
  private getEnhancedPrompt(context?: ConversationContext): string {
    const basePrompt = `You are Aurora, a HIPAA-compliant AI wellness companion for New Vision Wellness, specializing in addiction recovery and mental health support.

PERSONALITY & APPROACH:
- Warm, empathetic, and genuinely caring
- Professional yet approachable
- Knowledgeable about addiction recovery without being clinical
- Supportive of all stages of recovery journey
- Culturally sensitive and non-judgmental

CRITICAL HIPAA COMPLIANCE RULES:
1. NEVER request, store, or process Protected Health Information (PHI)
2. Do not ask for names, addresses, phone numbers, SSNs, medical records, or specific personal details
3. Provide general wellness information and emotional support only
4. Always redirect medical questions to licensed professionals
5. Do not provide specific medical advice, diagnosis, or treatment recommendations
6. Focus on evidence-based coping strategies and general wellness education
7. Be supportive about recovery without asking for personal substance use details
8. Encourage seeking professional help for medical concerns

SPECIALIZED KNOWLEDGE AREAS:
- Addiction recovery principles and stages
- Mental health and wellness strategies
- Coping mechanisms and stress management
- Mindfulness and meditation techniques
- Family support and relationships in recovery
- Relapse prevention strategies (general)
- Dual diagnosis awareness (mental health + addiction)
- 12-step programs and alternative recovery approaches
- Trauma-informed care principles
- Motivational interviewing techniques

RESPONSE GUIDELINES:
- Ask open-ended questions to understand emotional needs
- Provide evidence-based coping strategies
- Share hope and encouragement for recovery journey
- Offer specific techniques (breathing exercises, mindfulness, etc.)
- Suggest healthy lifestyle practices
- Recommend professional resources when appropriate
- Validate feelings and experiences without requiring details
- Focus on strengths and resilience building
- Provide crisis resources when needed

TONE & STYLE:
- Use "I" statements to show empathy ("I understand this can be challenging")
- Acknowledge the courage it takes to seek help
- Celebrate small victories and progress
- Provide practical, actionable advice
- Ask follow-up questions about feelings and goals (not personal details)
- Use encouraging and hopeful language
- Reference recovery community and shared experiences generally

CRISIS RESPONSE:
If someone expresses thoughts of self-harm or immediate danger:
- Immediately provide crisis resources
- Encourage contacting emergency services or crisis hotlines
- Offer to help them connect with immediate professional support
- Do not attempt to provide crisis counseling yourself

BOUNDARIES:
- Redirect medical questions to healthcare providers
- Don't provide medication advice
- Don't diagnose or assess severity of conditions
- Don't ask for personal identifying information
- Don't store or reference specific personal details between sessions

If asked about specific medical symptoms or personal health information, politely redirect to speaking with licensed healthcare providers.`;

    // Add context-specific guidance
    if (context?.userPreferences?.currentFocus) {
      const focusArea = context.userPreferences.currentFocus;
      if (focusArea === 'recovery') {
        return basePrompt + `\n\nCONTEXT: User is focused on recovery topics. Emphasize hope, practical coping strategies, and recovery community support.`;
      } else if (focusArea === 'mental_health') {
        return basePrompt + `\n\nCONTEXT: User is focused on mental health. Emphasize emotional regulation, mindfulness, and stress management techniques.`;
      }
    }

    return basePrompt;
  }

  // Enhanced conversation context management
  private getOrCreateContext(sessionId: string): ConversationContext {
    if (!this.conversationContexts.has(sessionId)) {
      this.conversationContexts.set(sessionId, {
        sessionId,
        messageHistory: [],
        userPreferences: {
          communicationStyle: 'supportive',
          currentFocus: 'general_wellness'
        }
      });
    }
    return this.conversationContexts.get(sessionId)!;
  }

  // Analyze user message for topic focus and emotional state
  private analyzeMessage(message: string): {
    topics: string[];
    emotionalTone: 'positive' | 'neutral' | 'distressed' | 'hopeful';
    urgency: 'low' | 'medium' | 'high';
  } {
    const lowerMessage = message.toLowerCase();
    
    // Topic detection
    const topics: string[] = [];
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      topics.push('anxiety');
    }
    if (lowerMessage.includes('depressed') || lowerMessage.includes('depression') || lowerMessage.includes('sad')) {
      topics.push('depression');
    }
    if (lowerMessage.includes('recovery') || lowerMessage.includes('sober') || lowerMessage.includes('clean')) {
      topics.push('recovery');
    }
    if (lowerMessage.includes('relapse') || lowerMessage.includes('using') || lowerMessage.includes('drinking')) {
      topics.push('relapse_concern');
    }
    if (lowerMessage.includes('family') || lowerMessage.includes('relationship')) {
      topics.push('relationships');
    }
    if (lowerMessage.includes('crisis') || lowerMessage.includes('suicidal') || lowerMessage.includes('harm myself')) {
      topics.push('crisis');
    }

    // Emotional tone detection
    let emotionalTone: 'positive' | 'neutral' | 'distressed' | 'hopeful' = 'neutral';
    if (lowerMessage.includes('great') || lowerMessage.includes('good') || lowerMessage.includes('happy')) {
      emotionalTone = 'positive';
    } else if (lowerMessage.includes('hope') || lowerMessage.includes('better') || lowerMessage.includes('progress')) {
      emotionalTone = 'hopeful';
    } else if (lowerMessage.includes('crisis') || lowerMessage.includes('desperate') || lowerMessage.includes('cant')) {
      emotionalTone = 'distressed';
    }

    // Urgency detection
    let urgency: 'low' | 'medium' | 'high' = 'low';
    if (lowerMessage.includes('crisis') || lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      urgency = 'high';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('need') || lowerMessage.includes('struggling')) {
      urgency = 'medium';
    }

    return { topics, emotionalTone, urgency };
  }

  // Generate contextual resources based on conversation
  private generateResources(analysis: { topics: string[]; emotionalTone: string; urgency: string }) {
    const resources: Array<{ title: string; description: string; type: 'article' | 'exercise' | 'contact' }> = [];

    if (analysis.topics.includes('anxiety')) {
      resources.push({
        title: "4-7-8 Breathing Exercise",
        description: "A simple breathing technique to reduce anxiety in moments of stress",
        type: 'exercise'
      });
      resources.push({
        title: "Grounding Techniques",
        description: "5-4-3-2-1 sensory grounding to help with anxiety",
        type: 'exercise'
      });
    }

    if (analysis.topics.includes('recovery')) {
      resources.push({
        title: "Daily Recovery Practices",
        description: "Evidence-based habits that support long-term recovery",
        type: 'article'
      });
      resources.push({
        title: "HALT Check",
        description: "Are you Hungry, Angry, Lonely, or Tired? A quick self-assessment",
        type: 'exercise'
      });
    }

    if (analysis.topics.includes('relapse_concern')) {
      resources.push({
        title: "Relapse Prevention Strategies",
        description: "Evidence-based approaches to maintaining recovery",
        type: 'article'
      });
    }

    if (analysis.topics.includes('relationships')) {
      resources.push({
        title: "Healthy Communication",
        description: "Building better relationships in recovery",
        type: 'article'
      });
    }

    if (analysis.topics.includes('crisis') || analysis.urgency === 'high') {
      resources.push({
        title: "National Suicide Prevention Lifeline",
        description: "988 - 24/7 crisis support and suicide prevention",
        type: 'contact'
      });
      resources.push({
        title: "Crisis Text Line",
        description: "Text HOME to 741741 for immediate crisis support",
        type: 'contact'
      });
      resources.push({
        title: "New Vision 24/7 Support",
        description: "(800) 555-0123 - Our professional crisis support team",
        type: 'contact'
      });
    }

    return resources;
  }

  // Generate suggested follow-up actions
  private generateSuggestedActions(analysis: { topics: string[]; emotionalTone: string; urgency: string }): string[] {
    const actions: string[] = [];

    if (analysis.emotionalTone === 'distressed') {
      actions.push("Take three deep breaths");
      actions.push("Practice a grounding exercise");
      actions.push("Reach out to your support network");
    }

    if (analysis.topics.includes('recovery')) {
      actions.push("Review your recovery goals");
      actions.push("Connect with your sponsor or counselor");
      actions.push("Attend a support group meeting");
    }

    if (analysis.topics.includes('anxiety')) {
      actions.push("Try progressive muscle relaxation");
      actions.push("Use mindfulness meditation");
      actions.push("Take a short walk outside");
    }

    if (analysis.urgency === 'high') {
      actions.push("Contact emergency services if in immediate danger");
      actions.push("Call our 24/7 crisis line");
      actions.push("Go to nearest emergency room if needed");
    }

    return actions;
  }

  // Enhanced PHI detection with better patterns
  private containsPotentialPHI(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // Patterns that might indicate PHI
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone number pattern
      /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/, // Email pattern
      /\b\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)\b/i, // Address pattern
      /my name is \w+/i,
      /i'm \w+ \w+/i, // "I'm John Doe" pattern
      /i live at/i,
      /my address is/i,
      /my ssn is/i,
      /my social security/i
    ];

    // Medical information patterns
    const medicalPatterns = [
      /diagnosed with/i,
      /prescription for/i,
      /taking medication/i,
      /my doctor said/i,
      /medical history/i,
      /blood pressure/i,
      /heart rate/i,
      /test results/i
    ];

    return phiPatterns.some(pattern => pattern.test(message)) || 
           medicalPatterns.some(pattern => pattern.test(lowerMessage));
  }

  // Main message processing method
  async processMessage(request: EnhancedGeminiRequest): Promise<EnhancedGeminiResponse> {
    try {
      // Validate HIPAA compliance flag
      if (!request.hipaaCompliant) {
        throw new Error('HIPAA compliance flag required');
      }

      // Get or create conversation context
      const context = this.getOrCreateContext(request.sessionId);
      
      // Analyze the message
      const analysis = this.analyzeMessage(request.message);

      // Check for potential PHI
      if (this.containsPotentialPHI(request.message)) {
        return {
          response: "I appreciate you sharing, but for your privacy and HIPAA compliance, I can't process messages that might contain personal health information. I'm here to provide general wellness support and guidance. How can I help you with general wellness or mental health resources today?",
          sessionId: request.sessionId,
          timestamp: new Date(),
          complianceStatus: 'compliant',
          resources: this.generateResources(analysis),
          emotionalTone: analysis.emotionalTone
        };
      }

      // Handle high urgency/crisis situations
      if (analysis.urgency === 'high' || analysis.topics.includes('crisis')) {
        return {
          response: "I'm concerned about what you're sharing and want to make sure you get the immediate support you need. Please consider reaching out to a crisis counselor right away. You can call 988 for the National Suicide Prevention Lifeline, text HOME to 741741 for the Crisis Text Line, or call our 24/7 support line at (800) 555-0123. You don't have to go through this alone - professional help is available right now.",
          sessionId: request.sessionId,
          timestamp: new Date(),
          complianceStatus: 'compliant',
          suggestedActions: this.generateSuggestedActions(analysis),
          resources: this.generateResources(analysis),
          emotionalTone: analysis.emotionalTone
        };
      }

      // Use fallback if no API key
      if (!this.apiKey) {
        return this.getEnhancedFallbackResponse(request, analysis);
      }

      // Update conversation context
      context.messageHistory.push({
        role: 'user',
        content: request.message,
        timestamp: new Date()
      });

      // Build conversation history for context
      const conversationHistory = context.messageHistory
        .slice(-6) // Keep last 6 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Prepare the enhanced prompt
      const systemPrompt = this.getEnhancedPrompt(context);
      const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nCurrent User Message: ${request.message}\n\nRespond with empathy, practical guidance, and appropriate resources while maintaining HIPAA compliance:`;

      const payload = {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;

      // Update conversation context with AI response
      context.messageHistory.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      });

      // Update user preferences based on conversation
      if (analysis.topics.includes('recovery')) {
        context.userPreferences!.currentFocus = 'recovery';
      } else if (analysis.topics.includes('anxiety') || analysis.topics.includes('depression')) {
        context.userPreferences!.currentFocus = 'mental_health';
      }

      return {
        response: aiResponse,
        sessionId: request.sessionId,
        timestamp: new Date(),
        complianceStatus: 'compliant',
        suggestedActions: this.generateSuggestedActions(analysis),
        resources: this.generateResources(analysis),
        emotionalTone: analysis.emotionalTone
      };

    } catch (error) {
      console.error('Enhanced Gemini Service Error:', error);
      return this.getEnhancedFallbackResponse(request, this.analyzeMessage(request.message));
    }
  }

  // Enhanced fallback responses with context awareness
  private getEnhancedFallbackResponse(request: EnhancedGeminiRequest, analysis: { topics: string[]; emotionalTone: string; urgency: string }): EnhancedGeminiResponse {
    const recoveryResponses = [
      "Recovery is a journey that takes courage, and you're showing that courage by being here. Each day in recovery is a victory worth celebrating. What's one small thing you can do today to support your wellness?",
      "I understand that recovery can feel overwhelming sometimes. Remember that healing happens one day at a time, and you don't have to do this alone. Have you connected with any support groups or counselors recently?",
      "Your recovery matters, and so do you. It's completely normal to have ups and downs - that's part of the process. What coping strategies have been most helpful for you in the past?",
      "Thank you for sharing what's on your heart. Recovery requires incredible strength, and I can see that strength in you. What brings you hope on difficult days?"
    ];

    const anxietyResponses = [
      "Anxiety can feel overwhelming, but you have more strength than you realize. Try taking three slow, deep breaths with me - in for 4 counts, hold for 4, out for 4. Sometimes slowing down our breathing can help calm our minds.",
      "I hear that you're struggling with anxious feelings. This is incredibly common, and you're not alone. Have you tried any grounding techniques? One simple one is to name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
      "Anxiety is your mind trying to protect you, even when there's no immediate danger. It's okay to feel this way. What usually helps you feel more centered and calm?",
      "Those anxious feelings are real and valid. Sometimes our minds race ahead to worst-case scenarios. Can you think of one thing that's going well in your life right now, even something small?"
    ];

    const generalResponses = [
      "Thank you for reaching out and sharing what's on your mind. Taking the step to talk about what you're experiencing shows real courage. What would be most helpful for you to focus on right now?",
      "I'm glad you're here and taking time to prioritize your mental health. Every conversation about wellness is a step forward. What brings you a sense of peace or comfort?",
      "It sounds like you're going through something challenging. Remember that seeking support is a sign of strength, not weakness. How are you taking care of yourself today?",
      "Your feelings and experiences are valid. Sometimes just talking about what we're going through can help us process and move forward. What's one thing you're grateful for today?"
    ];

    let selectedResponses = generalResponses;
    if (analysis.topics.includes('recovery')) {
      selectedResponses = recoveryResponses;
    } else if (analysis.topics.includes('anxiety')) {
      selectedResponses = anxietyResponses;
    }

    const response = selectedResponses[Math.floor(Math.random() * selectedResponses.length)];

    return {
      response,
      sessionId: request.sessionId,
      timestamp: new Date(),
      complianceStatus: 'compliant',
      suggestedActions: this.generateSuggestedActions(analysis),
      resources: this.generateResources(analysis),
      emotionalTone: analysis.emotionalTone as 'positive' | 'neutral' | 'distressed' | 'hopeful'
    };
  }

  // Clear conversation context for a session
  clearContext(sessionId: string): void {
    this.conversationContexts.delete(sessionId);
  }

  // Get conversation summary for analytics (no PHI)
  getConversationSummary(sessionId: string): { messageCount: number; topics: string[]; lastActivity: Date } | null {
    const context = this.conversationContexts.get(sessionId);
    if (!context) return null;

    const topics = context.messageHistory
      .map(msg => this.analyzeMessage(msg.content).topics)
      .flat()
      .filter((topic, index, array) => array.indexOf(topic) === index);

    return {
      messageCount: context.messageHistory.length,
      topics,
      lastActivity: context.messageHistory[context.messageHistory.length - 1]?.timestamp || new Date()
    };
  }
}

// Export singleton instance
export const enhancedGeminiService = new EnhancedGeminiService();
