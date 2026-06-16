export interface AiGenerateJsonParams {
  systemPrompt: string;
  userPrompt: string;
  schema?: any; // The Zod schema object to validate against or pass to structured outputs
}

export interface AiGenerateTextParams {
  systemPrompt: string;
  userPrompt: string;
}

export interface AiProviderInterface {
  name: string;
  generateJson<T>(params: AiGenerateJsonParams): Promise<T>;
  generateText(params: AiGenerateTextParams): Promise<string>;
}
