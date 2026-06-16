import { z } from "zod";

export const StructuredResumeSchema = z.object({
  language: z.enum(["pt-BR", "en-US"]),
  templateId: z.enum(["basic-ats", "modern-ats"]),
  contact: z.object({
    fullName: z.string(),
    title: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
  }),
  summary: z.string().optional(),
  skills: z.array(z.object({
    group: z.string(),
    items: z.array(z.string()),
  })),
  experience: z.array(z.object({
    company: z.string(),
    title: z.string(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
    bullets: z.array(z.string()),
    technologies: z.array(z.string()),
  })),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    bullets: z.array(z.string()),
    technologies: z.array(z.string()),
    link: z.string().optional(),
  })),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string().optional(),
    date: z.string().optional(),
  })),
  languages: z.array(z.object({
    language: z.string(),
    level: z.string(),
  })),
});

export type StructuredResume = z.infer<typeof StructuredResumeSchema>;
