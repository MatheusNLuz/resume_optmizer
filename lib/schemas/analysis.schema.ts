import { z } from "zod";

export const ResumeAnalysisSchema = z.object({
  detectedLanguage: z.enum(["pt-BR", "en-US", "unknown"]).catch("unknown"),
  recommendedLanguage: z.enum(["pt-BR", "en-US"]).catch("pt-BR"),
  detectedSeniority: z.enum(["junior", "mid", "senior", "lead", "unknown"]).catch("unknown"),
  recommendedLength: z.object({
    pages: z.string().default("1"),
    reason: z.string().default(""),
  }).default({ pages: "1", reason: "" }),
  atsIssues: z.array(z.object({
    type: z.string(),
    severity: z.enum(["low", "medium", "high"]).catch("low"),
    description: z.string(),
    recommendation: z.string(),
  })).default([]),
  sensitiveDataWarnings: z.array(z.object({
    type: z.string(),
    foundText: z.string().optional(),
    recommendation: z.string(),
  })).default([]),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  skillsFound: z.array(z.string()).default([]),
  sectionsFound: z.array(z.string()).default([]),
  sectionsMissing: z.array(z.string()).default([]),
  scores: z.object({
    overall: z.number().default(0),
    ats: z.number().default(0),
    structure: z.number().default(0),
    clarity: z.number().default(0),
    keywords: z.number().default(0),
    impact: z.number().default(0),
    perceivedSeniority: z.number().default(0),
    internationalCompatibility: z.number().optional(),
  }),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
