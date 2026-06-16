import { AiProviderInterface, AiGenerateJsonParams, AiGenerateTextParams } from "./ai-provider.interface";

export class OpenRouterProvider implements AiProviderInterface {
  name = "OpenRouter";
  private apiKey: string;
  private model: string;
  private baseUrl = "https://openrouter.ai/api/v1/chat/completions";

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || "";
    this.model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
  }

  async generateJson<T>(params: AiGenerateJsonParams): Promise<T> {
    if (!this.apiKey) throw new Error("OpenRouter API key is missing");

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: params.systemPrompt },
          { role: "user", content: params.userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: parseFloat(process.env.AI_DEFAULT_TEMPERATURE || "0.2"),
      })
    });

    if (!response.ok) {
      let errText = response.statusText;
      try {
        const errJson = await response.json();
        if (errJson?.error?.message) errText = errJson.error.message;
      } catch (e) {}
      throw new Error(`OpenRouter API error: ${errText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`OpenRouter API error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`OpenRouter returned unexpected response format: ${JSON.stringify(data)}`);
    }
    const content = data.choices[0].message.content;
    
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    // Attempt to parse JSON
    try {
      const parsed = JSON.parse(cleanContent);
      return parsed as T;
    } catch (e) {
      console.error("JSON Parse Error. Raw content:", content);
      throw new Error("Failed to parse JSON from OpenRouter");
    }
  }

  async generateText(params: AiGenerateTextParams): Promise<string> {
    if (!this.apiKey) throw new Error("OpenRouter API key is missing");

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: params.systemPrompt },
          { role: "user", content: params.userPrompt }
        ],
        temperature: parseFloat(process.env.AI_DEFAULT_TEMPERATURE || "0.2"),
      })
    });

    if (!response.ok) {
      let errText = response.statusText;
      try {
        const errJson = await response.json();
        if (errJson?.error?.message) errText = errJson.error.message;
      } catch (e) {}
      throw new Error(`OpenRouter API error: ${errText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`OpenRouter API error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`OpenRouter returned unexpected response format: ${JSON.stringify(data)}`);
    }
    return data.choices[0].message.content;
  }
}
