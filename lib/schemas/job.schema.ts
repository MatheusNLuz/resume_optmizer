import { z } from "zod";

export const JobParseSchema = z.object({
  jobTitle: z.string().optional(),
  seniority: z.enum(["intern", "junior", "mid", "senior", "lead", "unknown"]),
  detectedLanguage: z.enum(["pt-BR", "en-US", "unknown"]),
  countryOrRegion: z.string().optional(),
  location: z.string().optional(),
  workModel: z.enum(["remote", "hybrid", "onsite", "unknown"]),
  contractType: z.string().optional(),
  requiredSkills: z.array(z.string()),
  niceToHaveSkills: z.array(z.string()),
  softSkills: z.array(z.string()),
  tools: z.array(z.string()),
  programmingLanguages: z.array(z.string()),
  frameworks: z.array(z.string()),
  databases: z.array(z.string()),
  cloudPlatforms: z.array(z.string()),
  devOps: z.array(z.string()),
  testing: z.array(z.string()),
  methodologies: z.array(z.string()),
  languages: z.array(z.string()),
  certifications: z.array(z.string()),
  responsibilities: z.array(z.string()),
  minimumExperience: z.string().optional(),
});

export const RequirementMatrixSchema = z.object({
  requirements: z.array(z.object({
    requirement: z.string(),
    category: z.enum([
      "hard_skill",
      "soft_skill",
      "experience",
      "education",
      "certification",
      "language",
      "responsibility",
      "tool",
      "methodology",
      "other"
    ]),
    importance: z.enum(["required", "preferred", "nice_to_have", "unknown"]),
    status: z.enum(["met", "partially_met", "missing", "not_confirmed", "not_applicable"]),
    evidenceFound: z.string().optional(),
    evidenceStrength: z.enum(["strong", "medium", "weak", "none"]),
    recommendedAction: z.string(),
  })),
});

export type JobParse = z.infer<typeof JobParseSchema>;
export type RequirementMatrix = z.infer<typeof RequirementMatrixSchema>;
