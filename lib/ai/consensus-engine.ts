import { OpenRouterProvider } from "./openrouter-provider";
import { NvidiaNimProvider } from "./nvidia-nim-provider";

export class ConsensusEngine {
  private primary: OpenRouterProvider;
  private secondary: NvidiaNimProvider;

  constructor() {
    this.primary = new OpenRouterProvider();
    this.secondary = new NvidiaNimProvider();
  }

  async analyzeWithConsensus<T>(systemPrompt: string, userPrompt: string): Promise<T> {
    const hasNvidia = !!process.env.NVIDIA_NIM_API_KEY || !!(typeof window !== "undefined" && localStorage.getItem("NVIDIA_NIM_API_KEY"));
    
    // If no secondary provider is configured, fallback to single provider
    if (!hasNvidia) {
      console.log("[ConsensusEngine] NVIDIA key not found. Using OpenRouter only.");
      return this.primary.generateJson<T>({ systemPrompt, userPrompt });
    }

    try {
      console.log("[ConsensusEngine] Bypassing heavy consensus to avoid Vercel 60s timeouts. Using primary only.");
      return await this.primary.generateJson<T>({ systemPrompt, userPrompt });
    } catch (e) {
      console.error("[ConsensusEngine] Error:", e);
      // Fallback to basic single provider
      return this.primary.generateJson<T>({ systemPrompt, userPrompt });
    }
  }
}
