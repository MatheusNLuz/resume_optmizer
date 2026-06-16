import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ConsensusEngine } from "@/lib/ai/consensus-engine";
import { ATS_ANALYZER_SYSTEM_PROMPT, generateAtsAnalyzerUserPrompt } from "@/lib/ai/prompts";
import { ResumeAnalysis, ResumeAnalysisSchema } from "@/lib/schemas/analysis.schema";
import { ScoreEngine } from "@/lib/ats/score-engine";
import { GamificationEngine } from "@/lib/gamification/gamification-engine";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { analysisId } = body;

    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 });
    }

    const analysisRecord = await prisma.analysis.findUnique({
      where: { id: analysisId }
    });

    if (!analysisRecord || !analysisRecord.parsedResumeText) {
      return NextResponse.json({ error: "Analysis record or parsed resume text not found" }, { status: 404 });
    }

    const engine = new ConsensusEngine();
    
    // Generate AI Analysis using Consensus
    const rawAnalysis = await engine.analyzeWithConsensus<ResumeAnalysis>(
      ATS_ANALYZER_SYSTEM_PROMPT,
      generateAtsAnalyzerUserPrompt(
        analysisRecord.parsedResumeText, 
        analysisRecord.professionalTarget || "General", 
        analysisRecord.mode, 
        analysisRecord.selectedLanguage
      )
    );

    // Validate with Zod
    const validatedAnalysis = ResumeAnalysisSchema.parse(rawAnalysis);

    // Recalculate/normalize scores
    const calculatedScores = ScoreEngine.evaluate(validatedAnalysis);
    validatedAnalysis.scores = calculatedScores;

    // Gamification
    const gamification = GamificationEngine.evaluate(validatedAnalysis);

    // Save back to database
    const updatedRecord = await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        analysisJson: JSON.stringify(validatedAnalysis),
        initialScores: JSON.stringify(calculatedScores),
        gamificationJson: JSON.stringify(gamification),
        selectedLanguage: validatedAnalysis.recommendedLanguage || analysisRecord.selectedLanguage,
      }
    });

    return NextResponse.json({
      success: true,
      analysis: validatedAnalysis,
      scores: calculatedScores,
      gamification
    });

  } catch (error) {
    console.error("Error running analysis engine:", error);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
