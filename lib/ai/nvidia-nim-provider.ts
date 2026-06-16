import { AiProviderInterface, AiGenerateJsonParams, AiGenerateTextParams } from "./ai-provider.interface";

export class NvidiaNimProvider implements AiProviderInterface {
  name = "NVIDIA NIM";
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.NVIDIA_NIM_API_KEY || "";
    this.baseUrl = process.env.NVIDIA_NIM_BASE_URL || "https://integrate.api.nvidia.com/v1/chat/completions";
    this.model = process.env.NVIDIA_NIM_MODEL || "meta/llama3-70b-instruct";
  }

  async generateJson<T>(params: AiGenerateJsonParams): Promise<T> {
    if (!this.apiKey) throw new Error("NVIDIA NIM API key is missing");

    const url = this.baseUrl.endsWith("/chat/completions") ? this.baseUrl : `${this.baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: params.systemPrompt },
          { role: "user", content: params.userPrompt }
        ],
        temperature: parseFloat(process.env.AI_DEFAULT_TEMPERATURE || "0.2"),
        max_tokens: parseInt(process.env.AI_MAX_TOKENS || "8000"),
      })
    });

    if (!response.ok) {
      let errText = response.statusText;
      try {
        const errJson = await response.json();
        if (errJson?.error?.message) errText = errJson.error.message;
      } catch (e) {}
      throw new Error(`NVIDIA NIM API error: ${errText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`NVIDIA NIM API error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`NVIDIA NIM returned unexpected response format: ${JSON.stringify(data)}`);
    }
    const content = data.choices[0].message.content;

    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }
    
    try {
      const parsed = JSON.parse(cleanContent);
      return parsed as T;
    } catch (e) {
      console.error("JSON Parse Error. Raw content:", content);
      throw new Error("Failed to parse JSON from NVIDIA NIM");
    }
  }

  async generateText(params: AiGenerateTextParams): Promise<string> {
    if (!this.apiKey) throw new Error("NVIDIA NIM API key is missing");

    const url = this.baseUrl.endsWith("/chat/completions") ? this.baseUrl : `${this.baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: params.systemPrompt },
          { role: "user", content: params.userPrompt }
        ],
        temperature: parseFloat(process.env.AI_DEFAULT_TEMPERATURE || "0.2"),
        max_tokens: parseInt(process.env.AI_MAX_TOKENS || "8000"),
      })
    });

    if (!response.ok) {
      let errText = response.statusText;
      try {
        const errJson = await response.json();
        if (errJson?.error?.message) errText = errJson.error.message;
      } catch (e) {}
      throw new Error(`NVIDIA NIM API error: ${errText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`NVIDIA NIM API error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`NVIDIA NIM returned unexpected response format: ${JSON.stringify(data)}`);
    }
    return data.choices[0].message.content;
  }
}
