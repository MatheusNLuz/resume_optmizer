import { AnalysisOrchestrator } from "@/lib/ai/analysis-orchestrator";
import { JobParse, JobParseSchema } from "@/lib/schemas/job.schema";

const JOB_PARSER_SYSTEM_PROMPT = `You are an expert technical recruiter and AI job parser.
Your task is to extract structured data from a job description.
Identify the hard skills, soft skills, required experience, and technologies accurately.
Return only valid JSON matching the provided schema.`;

export class JobParser {
  static async parse(jobDescription: string): Promise<JobParse> {
    const orchestrator = new AnalysisOrchestrator();
    
    const rawResult = await orchestrator.analyze<JobParse>(
      JOB_PARSER_SYSTEM_PROMPT,
      `Job Description:\n"""\n${jobDescription}\n"""\n\nExtract all the requirements into the JSON schema.`
    );
    
    return JobParseSchema.parse(rawResult);
  }
}
