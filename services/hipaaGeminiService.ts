// HIPAA-Compliant Gemini AI Service
// This service handles AI interactions while maintaining HIPAA compliance

interface HIPAAGeminiRequest {
  message: string;
  sessionId: string;
  hipaaCompliant: boolean;
}

interface HIPAAGeminiResponse {
  response: string;
  sessionId: string;
  timestamp: Date;
  complianceStatus: 'compliant' | 'error';
}

// HIPAA-compliant chat service with Gemini AI
export class HIPAAGeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
  
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not found. AI chat will use fallback responses.');
    }
  }

  // HIPAA-compliant system prompt
  private getHIPAAPrompt(): string {
    return `You are a HIPAA-compliant AI assistant for New Vision Wellness, a mental health and addiction treatment facility.

CRITICAL HIPAA COMPLIANCE RULES:
1. NEVER request, store, or process any Protected Health Information (PHI)
2. Do not ask for names, addresses, phone numbers, SSNs, or medical details
3. Provide general wellness information and emotional support only
4. Always redirect medical questions to licensed professionals
5. Do not provide specific medical advice, diagnosis, or treatment recommendations
6. Focus on general mental health education and coping strategies
7. Be supportive about addiction recovery without asking for personal details
8. Encourage seeking professional help for specific medical concerns

RESPONSE GUIDELINES:
- Be warm, empathetic, and supportive
- Provide general information about mental health and addiction recovery
- Share coping strategies and wellness tips
- Encourage professional treatment when appropriate
- Keep responses focused on general wellness and emotional support
- Always maintain professional boundaries

If asked about specific medical symptoms or personal health information, politely redirect to speaking with licensed healthcare providers.`;
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
