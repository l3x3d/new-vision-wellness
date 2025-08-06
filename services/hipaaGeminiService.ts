// HIPAA-Compliant Gemini 2.5 AI Service
// Enhanced AI agent with specialized addiction recovery knowledge

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

interface HIPAAGeminiRequest {
  message: string;
  sessionId: string;
  hipaaCompliant: boolean;
  context?: ConversationContext;
}

interface HIPAAGeminiResponse {
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
}

// Enhanced HIPAA-compliant chat service with Gemini 2.5 AI
export class HIPAAGeminiService {
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
  private getEnhancedHIPAAPrompt(context?: ConversationContext): string {
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
  // Enhanced HIPAA-compliant system prompt with addiction recovery specialization
  private getEnhancedHIPAAPrompt(context?: ConversationContext): string {
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
    }

    if (analysis.topics.includes('recovery')) {
      resources.push({
        title: "Daily Recovery Practices",
        description: "Evidence-based habits that support long-term recovery",
        type: 'article'
      });
    }

    if (analysis.urgency === 'high') {
      resources.push({
        title: "24/7 Crisis Support",
        description: "Immediate professional support available anytime",
        type: 'contact'
      });
    }

    return resources;
  }
  }

  // Process message through Gemini AI with HIPAA compliance
  async processMessage(request: HIPAAGeminiRequest): Promise<HIPAAGeminiResponse> {
    try {
      // Validate HIPAA compliance flag
      if (!request.hipaaCompliant) {
        throw new Error('HIPAA compliance flag required');
      }

      // Check for potential PHI in the message (basic detection)
      if (this.containsPotentialPHI(request.message)) {
        return {
          response: "I appreciate you sharing, but for your privacy and HIPAA compliance, I can't process messages that might contain personal health information. I'm here to provide general wellness support and guidance. How can I help you with general wellness or mental health resources?",
          sessionId: request.sessionId,
          timestamp: new Date(),
          complianceStatus: 'compliant'
        };
      }

      if (!this.apiKey) {
        return this.getFallbackResponse(request);
      }

      const payload = {
        contents: [{
          parts: [{
            text: `${this.getHIPAAPrompt()}\n\nUser message: ${request.message}\n\nRespond with empathy while maintaining HIPAA compliance:`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
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
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Additional HIPAA compliance check on AI response
        const filteredResponse = this.filterHIPAAResponse(aiResponse);
        
        return {
          response: filteredResponse,
          sessionId: request.sessionId,
          timestamp: new Date(),
          complianceStatus: 'compliant'
        };
      } else {
        throw new Error('Invalid response from Gemini API');
      }

    } catch (error) {
      console.error('HIPAA Gemini Service Error:', error);
      return this.getFallbackResponse(request);
    }
  }

  // Basic PHI detection (enhance in production)
  private containsPotentialPHI(message: string): boolean {
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone number pattern
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email pattern
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // Date pattern
      /\b(anxiety|depression|bipolar|schizophrenia|medication|prescription|dosage)\b/i, // Medical terms
    ];

    return phiPatterns.some(pattern => pattern.test(message));
  }

  // Filter AI response for HIPAA compliance
  private filterHIPAAResponse(response: string): string {
    // Remove any potential requests for PHI
    const filteredResponse = response
      .replace(/what is your (name|address|phone|email)/gi, '')
      .replace(/can you tell me your/gi, 'I focus on general wellness support rather than personal details. How can I help with');

    return filteredResponse;
  }

  // Fallback responses when AI is unavailable
  private getFallbackResponse(request: HIPAAGeminiRequest): HIPAAGeminiResponse {
    const fallbackResponses = [
      "I'm here to support your wellness journey. While I can't provide specific medical advice, I can offer general guidance on mental health and addiction recovery. What would you like to know more about?",
      "Thank you for reaching out. I'm designed to provide general wellness support and information about mental health resources. For specific medical questions, I'd encourage you to speak with our licensed professionals. How can I help with general wellness topics?",
      "I appreciate you sharing with me. I focus on providing general mental health education and emotional support. For personalized medical advice, our licensed staff would be the best resource. What general wellness topics interest you?",
      "I'm glad you're taking steps toward wellness. I can share general information about mental health, coping strategies, and recovery resources. For specific treatment questions, our clinical team would be most helpful. What would you like to explore?",
      "Your wellness matters, and I'm here to provide general support and information. While I can't give medical advice, I can share wellness tips and general mental health resources. What aspects of wellness would you like to discuss?"
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return {
      response: randomResponse,
      sessionId: request.sessionId,
      timestamp: new Date(),
      complianceStatus: 'compliant'
    };
  }
}

// API endpoint handler (for Vercel serverless functions)
export async function POST(request: Request) {
  try {
    const body: HIPAAGeminiRequest = await request.json();
    
    // Validate required fields
    if (!body.message || !body.sessionId || !body.hipaaCompliant) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const geminiService = new HIPAAGeminiService();
    const response = await geminiService.processMessage(body);

    return Response.json(response, {
      headers: {
        'X-HIPAA-Compliant': 'true',
        'X-Session-ID': body.sessionId,
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { 
        error: 'Internal server error',
        response: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team for assistance.",
        complianceStatus: 'error'
      },
      { status: 500 }
    );
  }
}

export default HIPAAGeminiService;
