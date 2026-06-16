import { z } from "zod";

export const JobParseSchema = z.object({
  title: z.string(),
  seniority: z.enum(["junior", "mid", "senior", "lead", "unknown"]),
  requiredSkills: z.array(z.string()),
  niceToHaveSkills: z.array(z.string()),
  keyResponsibilities: z.array(z.string()),
});

export type JobParse = z.infer<typeof JobParseSchema>;

export const CompareSchema = z.object({
  matchPercentage: z.number(),
  missingMandatorySkills: z.array(z.string()),
  missingNiceToHaveSkills: z.array(z.string()),
  experienceGaps: z.array(z.string()),
  culturalMatchNotes: z.string(),
  recommendationsToMatch: z.array(z.string()),
});

export type CompareAnalysis = z.infer<typeof CompareSchema>;
