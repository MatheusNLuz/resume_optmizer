import { AnalysisOrchestrator } from "@/lib/ai/analysis-orchestrator";
import { TruthGuardGen, TruthGuardSchema } from "@/lib/schemas/questions.schema";

const TRUTH_GUARD_SYSTEM_PROMPT = `You are the Truth Guard. Your sole purpose is to prevent AI hallucination and ensure a candidate's resume contains NO lies.
You must classify every new claim, skill, or metric proposed for the resume rewrite.
A claim can ONLY be used if it is 'confirmed_by_resume' or 'confirmed_by_user'.
Any claim that is an invention or hallucination MUST be marked 'forbidden_to_use'.
Return ONLY valid JSON matching this exact structure:
{
  "claims": [
    {
      "claim": "string",
      "source": "confirmed_by_resume" | "confirmed_by_user" | "low_confidence_inference" | "missing" | "forbidden_to_use",
      "canUseInResume": boolean,
      "canUseInCoverLetter": boolean,
      "explanation": "string"
    }
  ],
  "blockedClaims": ["string"],
  "warnings": ["string"]
}`;

export class TruthGuard {
  static async evaluate(resumeText: string, userAnswers: string, proposedChanges: string): Promise<TruthGuardGen> {
    const orchestrator = new AnalysisOrchestrator();
    
    const userPrompt = `
ORIGINAL RESUME:
"""
${resumeText}
"""

USER ANSWERS TO CLARIFYING QUESTIONS:
"""
${userAnswers}
"""

PROPOSED CHANGES/NEW CONTENT TO ADD:
"""
${proposedChanges}
"""

Evaluate all proposed claims. Block anything not strictly supported by the original resume or user answers.`;

    const rawResult = await orchestrator.analyze<TruthGuardGen>(
      TRUTH_GUARD_SYSTEM_PROMPT,
      userPrompt
    );
    
    return TruthGuardSchema.parse(rawResult);
  }
}
