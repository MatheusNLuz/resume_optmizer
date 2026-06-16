import { z } from "zod";

export const SmartQuestionSchema = z.object({
  questions: z.array(z.object({
    id: z.string().default(""),
    question: z.string().default(""),
    reason: z.string().default(""),
    category: z.enum([
      "skill_confirmation",
      "experience_detail",
      "metric",
      "language_level",
      "project",
      "education",
      "certification",
      "other"
    ]).catch("other"),
    answerType: z.enum(["yes_no", "short_text", "long_text", "multiple_choice"]).catch("short_text"),
    options: z.array(z.string()).optional(),
    canAffectResume: z.boolean().default(false),
    canAffectScore: z.boolean().default(false),
  })).default([]),
});

export const TruthGuardSchema = z.object({
  claims: z.array(z.object({
    claim: z.string().default(""),
    source: z.enum([
      "confirmed_by_resume",
      "confirmed_by_user",
      "low_confidence_inference",
      "missing",
      "forbidden_to_use"
    ]).catch("low_confidence_inference"),
    canUseInResume: z.boolean().default(false),
    canUseInCoverLetter: z.boolean().default(false),
    explanation: z.string().default(""),
  })).default([]),
  blockedClaims: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

export type SmartQuestionGen = z.infer<typeof SmartQuestionSchema>;
export type TruthGuardGen = z.infer<typeof TruthGuardSchema>;
