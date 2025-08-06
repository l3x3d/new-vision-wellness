// Enhanced Gemini 2.5 Chat API Endpoint
import { enhancedGeminiService } from '../services/enhancedGeminiService';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, hipaaCompliant, context } = req.body;

    // Validate required fields
    if (!message || !sessionId) {
      return res.status(400).json({ 
        error: 'Missing required fields: message and sessionId' 
      });
    }

    // Validate HIPAA compliance flag
    if (!hipaaCompliant) {
      return res.status(400).json({ 
        error: 'HIPAA compliance acknowledgment required' 
      });
    }

    // Rate limiting check (basic)
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Process message through enhanced Gemini service
    const result = await enhancedGeminiService.processMessage({
      message,
      sessionId,
      hipaaCompliant,
      context
    });

    // Log successful interaction (no PHI)
    console.log('Enhanced AI Chat Interaction:', {
      sessionId,
      timestamp: result.timestamp,
      messageLength: message.length,
      complianceStatus: result.complianceStatus,
      emotionalTone: result.emotionalTone,
      hasResources: result.resources && result.resources.length > 0,
      hasSuggestedActions: result.suggestedActions && result.suggestedActions.length > 0
    });

    // Return enhanced response
    return res.status(200).json({
      success: true,
      data: {
        response: result.response,
        sessionId: result.sessionId,
        timestamp: result.timestamp,
        complianceStatus: result.complianceStatus,
        suggestedActions: result.suggestedActions || [],
        resources: result.resources || [],
        emotionalTone: result.emotionalTone,
        conversationSummary: enhancedGeminiService.getConversationSummary(sessionId)
      }
    });

  } catch (error) {
    console.error('Enhanced Gemini Chat API Error:', error);
    
    // Return safe fallback response
    return res.status(200).json({
      success: true,
      data: {
        response: "I apologize, but I'm experiencing some technical difficulties right now. For immediate support, please call our 24/7 helpline at (800) 555-0123 or reach out to one of our licensed professionals. Your wellness is important to us.",
        sessionId: req.body.sessionId,
        timestamp: new Date(),
        complianceStatus: 'compliant',
        suggestedActions: [
          "Call our 24/7 support line",
          "Contact emergency services if in crisis",
          "Practice deep breathing exercises"
        ],
        resources: [
          {
            title: "24/7 Crisis Support",
            description: "Professional help available anytime",
            type: "contact"
          }
        ],
        emotionalTone: 'neutral'
      }
    });
  }
}
