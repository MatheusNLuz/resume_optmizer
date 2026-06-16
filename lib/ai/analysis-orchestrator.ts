import { AiProviderInterface } from "./ai-provider.interface";
import { OpenRouterProvider } from "./openrouter-provider";
import { NvidiaNimProvider } from "./nvidia-nim-provider";

export class AnalysisOrchestrator {
  private primaryProvider: AiProviderInterface;
  private secondaryProvider: AiProviderInterface;

  constructor() {
    this.primaryProvider = new OpenRouterProvider();
    this.secondaryProvider = new NvidiaNimProvider();
  }

  // Basic implementation to fallback or use consensus
  async analyze<T>(systemPrompt: string, userPrompt: string, schema?: any): Promise<T> {
    try {
      // For now, default to primary provider
      return await this.primaryProvider.generateJson<T>({
        systemPrompt,
        userPrompt,
        schema,
      });
    } catch (error) {
      console.error(`Primary provider (${this.primaryProvider.name}) failed. Falling back.`, error);
      
      try {
        return await this.secondaryProvider.generateJson<T>({
          systemPrompt,
          userPrompt,
          schema,
        });
      } catch (fallbackError) {
        console.error(`Secondary provider (${this.secondaryProvider.name}) failed.`, fallbackError);
        throw new Error("All AI providers failed to generate analysis.");
      }
    }
  }

  // To be implemented: Multi-Model Consensus (Requirement 20)
  async generateConsensus<T>(systemPrompt: string, userPrompt: string): Promise<{ primary: T; secondary: T; consensus: any }> {
    const [primaryResult, secondaryResult] = await Promise.allSettled([
      this.primaryProvider.generateJson<T>({ systemPrompt, userPrompt }),
      this.secondaryProvider.generateJson<T>({ systemPrompt, userPrompt }),
    ]);

    if (primaryResult.status === "rejected" || secondaryResult.status === "rejected") {
      throw new Error("One or both providers failed during consensus generation.");
    }

    // A consensus engine would merge them here. 
    // Returning both for now.
    return {
      primary: primaryResult.value,
      secondary: secondaryResult.value,
      consensus: primaryResult.value, // Simplistic placeholder: defaults to primary
    };
  }
}
