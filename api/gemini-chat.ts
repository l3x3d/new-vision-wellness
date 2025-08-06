import { HIPAAGeminiService } from '../services/hipaaGeminiService';

// HIPAA-Compliant Gemini Chat API Endpoint
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, hipaaCompliant } = req.body;

    // Validate required fields
    if (!message || !sessionId || !hipaaCompliant) {
      return res.status(400).json({ 
        error: 'Missing required fields: message, sessionId, hipaaCompliant' 
      });
    }

    // Validate HIPAA compliance flag
    if (hipaaCompliant !== true) {
      return res.status(400).json({ 
        error: 'HIPAA compliance acknowledgment required' 
      });
    }

    // Process the message through HIPAA-compliant Gemini service
    const geminiService = new HIPAAGeminiService();
    const response = await geminiService.processMessage({
      message,
      sessionId,
      hipaaCompliant
    });

    // Set HIPAA compliance headers
    res.setHeader('X-HIPAA-Compliant', 'true');
    res.setHeader('X-Session-ID', sessionId);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Return the AI response
    return res.status(200).json(response);

  } catch (error) {
    console.error('HIPAA Gemini Chat API Error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      response: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team for assistance.",
      complianceStatus: 'error'
    });
  }
}
