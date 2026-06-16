import { ResumeAnalysis } from "@/lib/schemas/analysis.schema";

export interface GamificationState {
  level: number;
  levelName: string;
  missionsComplete: number;
  totalMissions: number;
  badges: string[];
}

export class GamificationEngine {
  static evaluate(analysis: ResumeAnalysis): GamificationState {
    const badges: string[] = [];
    let missionsComplete = 0;
    const totalMissions = 8; // Arbitrary total for Phase 1

    // 1. ATS Ready Badge
    if (analysis.scores.ats >= 85) {
      badges.push("ATS Ready");
      missionsComplete++;
    }

    // 2. Sensitive Data Cleared
    if (analysis.sensitiveDataWarnings.length === 0) {
      badges.push("Data Safe");
      missionsComplete++;
    }

    // 3. High Impact
    if (analysis.scores.impact >= 80) {
      badges.push("Impactful Experience");
      missionsComplete++;
    }

    // 4. Clarity
    if (analysis.scores.clarity >= 85) {
      badges.push("Crystal Clear");
      missionsComplete++;
    }

    // Overall Tier Check
    const overall = analysis.scores.overall;
    if (overall >= 90) badges.push("Top 10%");
    if (overall >= 90) missionsComplete += 4;
    else if (overall >= 75) missionsComplete += 2;
    else if (overall >= 50) missionsComplete += 1;

    let level = 1;
    let levelName = "Raw Resume";

    if (overall >= 90) {
      level = 5;
      levelName = "Ready to Apply";
    } else if (overall >= 80) {
      level = 4;
      levelName = "Competitive Resume";
    } else if (overall >= 60) {
      level = 3;
      levelName = "ATS Resume";
    } else if (overall >= 40) {
      level = 2;
      levelName = "Readable Resume";
    }

    return {
      level,
      levelName,
      missionsComplete: Math.min(missionsComplete, totalMissions),
      totalMissions,
      badges,
    };
  }
}
