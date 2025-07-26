
import { GoogleGenAI, Type } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

export const generateHopeStory = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Tell me a short, fictional, and anonymous story of hope and recovery from addiction. The tone should be uplifting and encouraging. Do not use real names or specific details. The story should be about 2-3 paragraphs long.",
      config: {
        systemInstruction: "You are an inspiring storyteller creating anonymous, fictional stories of hope for people seeking help with addiction. Never mention you are an AI.",
        temperature: 0.8,
        topK: 40,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story from Gemini API:", error);
    return "We couldn't generate a story at this moment. Please try again later. Remember, your own story of recovery is waiting to be written.";
  }
};

export interface InsuranceVerificationData {
    name: string;
    dob: string;
    provider: string;
    policyId: string;
}

export interface InsuranceVerificationResult {
    status: 'Verified' | 'Review Needed' | 'Plan Not Found';
    planName: string;
    coverageSummary: string;
    nextSteps: string;
}

export const verifyInsurance = async (data: InsuranceVerificationData): Promise<InsuranceVerificationResult> => {
    const schema = {
        type: Type.OBJECT,
        properties: {
            status: {
                type: Type.STRING,
                enum: ['Verified', 'Review Needed', 'Plan Not Found'],
                description: 'The final verification status.',
            },
            planName: {
                type: Type.STRING,
                description: 'The name of the insurance plan found, or "N/A" if not found.',
            },
            coverageSummary: {
                type: Type.STRING,
                description: 'A detailed, user-friendly summary of the benefits. For "Verified", describe the coverage (e.g., "Covers IOP at 80% after deductible"). For "Review Needed", explain what needs clarification. For "Plan Not Found", state that the plan could not be located.',
            },
            nextSteps: {
                type: Type.STRING,
                description: 'Clear, actionable next steps for the user. For "Verified", mention that the admissions team will call to confirm. For "Review Needed", state that the team will investigate. For "Plan Not Found", suggest calling admissions to verify manually.',
            },
        },
        required: ['status', 'planName', 'coverageSummary', 'nextSteps']
    };

    const prompt = `
      A potential patient is verifying their insurance for services at "NewVisionWellness".
      Patient Information:
      - Name: ${data.name}
      - Date of Birth: ${data.dob}
      - Insurance Provider: ${data.provider}
      - Policy ID: ${data.policyId}

      Analyze this information against your knowledge base and determine the coverage. Respond with the user's benefit details in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: `You are an expert AI Insurance Verification Specialist for a fictional treatment center called "NewVisionWellness". Your knowledge base contains fictional but realistic insurance plans. Your task is to provide a detailed and empathetic verification result based on the user's data. You must always respond in JSON.

Knowledge Base & Rules:
1.  **Recognized Providers**: 'Blue Cross', 'Aetna', 'Cigna', 'UnitedHealthcare', 'BCBS'. If the user's provider matches one of these, their plan is likely in-network.
2.  **Plan Tiers**:
    *   Policy IDs with a mix of letters and numbers (e.g., 'UHC123XYZ789') are 'Gold' or 'Platinum' plans. These have good coverage (e.g., "Covers IOP services at 80-90% after a $500 deductible is met.").
    *   Policy IDs with only numbers (e.g., '123456789') are 'Silver' or 'Bronze' plans. These have moderate coverage (e.g., "Covers IOP services at 60% after a $2500 deductible is met.").
    *   Policy IDs that are short or look like a group number (e.g., 'GRP1000') might be part of an employer plan that requires pre-authorization.
3.  **Status Logic**:
    *   'Verified': The provider is recognized and the policy ID is valid. Provide a detailed summary.
    *   'Review Needed': The policy ID seems valid but might require pre-authorization (e.g., group number), or the DOB is missing or seems invalid.
    *   'Plan Not Found': The provider name is obscure, fictional, or not on the recognized list (e.g., 'Sunshine Health').
4.  **Tone**: Be professional, clear, and reassuring. Always provide concrete next steps.`,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as InsuranceVerificationResult;
        
        if (!result.status || !result.coverageSummary) {
            throw new Error("Invalid response structure from AI.");
        }

        return result;

    } catch (error) {
        console.error("Error verifying insurance from Gemini API:", error);
        throw new Error("Failed to verify insurance. The API returned an error.");
    }
};
