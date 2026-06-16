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

    console.log("[ConsensusEngine] Running parallel analysis on OpenRouter and NVIDIA...");

    try {
      // Run both in parallel
      const [primaryResult, secondaryResult] = await Promise.allSettled([
        this.primary.generateText({ systemPrompt, userPrompt }),
        this.secondary.generateText({ systemPrompt, userPrompt })
      ]);

      if (primaryResult.status === "rejected" && secondaryResult.status === "rejected") {
        throw new Error("Both AI providers failed.");
      }

      const pResultText = primaryResult.status === "fulfilled" ? primaryResult.value : "FAILED";
      const sResultText = secondaryResult.status === "fulfilled" ? secondaryResult.value : "FAILED";

      // If one failed, just parse the other
      if (pResultText === "FAILED" && sResultText !== "FAILED") {
        return JSON.parse(sResultText.replace(/```json/g, "").replace(/```/g, "").trim()) as T;
      }
      if (sResultText === "FAILED" && pResultText !== "FAILED") {
        return JSON.parse(pResultText.replace(/```json/g, "").replace(/```/g, "").trim()) as T;
      }

      console.log("[ConsensusEngine] Parallel responses received. Generating consensus...");

      // Generate Consensus using the Primary Provider
      const consensusSystemPrompt = `You are the Consensus Engine.
Two different AI models analyzed the same data and produced the following JSON outputs.
Compare them, resolve any disagreements by choosing the most conservative and strict interpretation, and return the final unified JSON.
Return ONLY valid JSON matching the schema of the inputs.`;

      const consensusUserPrompt = `
OUTPUT 1:
${pResultText}

OUTPUT 2:
${sResultText}

Return the final combined JSON.`;

      return await this.primary.generateJson<T>({
        systemPrompt: consensusSystemPrompt,
        userPrompt: consensusUserPrompt
      });

    } catch (e) {
      console.error("[ConsensusEngine] Error:", e);
      // Fallback to basic single provider
      return this.primary.generateJson<T>({ systemPrompt, userPrompt });
    }
  }
}
