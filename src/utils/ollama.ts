// import fetch from 'node-fetch'; // rely on global fetch

export const OLLAMA_API_KEY = "9139754722444da1b6cffbe09a5fdce2.kcDsMQ7F13DjfagVGmyY6iVh";
export const OLLAMA_BASE_URL = "https://ollama.com/api";

export const MODELS = {
    REASONING: "deepseek-v3.2", // 688B - High intelligence for analysis
    CODING: "qwen3-coder:480b", // 510B - Good for structure/JSON
    FAST: "mistral-large-3:675b", // Good balance
    EMBEDDING: "gemma3:4b"
};

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface CompletionOptions {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    format?: "json" | object;
}

export class OllamaClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string = OLLAMA_API_KEY, baseUrl: string = OLLAMA_BASE_URL) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async chat(model: string, messages: ChatMessage[], options: CompletionOptions = {}): Promise<string> {
        const url = `${this.baseUrl}/chat`;

        // Default high-reasoning params if not specified
        const finalOptions = {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 4096,
            ...options
        };

        const body = {
            model,
            messages,
            stream: false,
            options: {
                temperature: finalOptions.temperature,
                top_p: finalOptions.top_p,
                num_predict: finalOptions.max_tokens
            },
            format: options.format
        };

        try {
            console.log(`🤖 Invoking AI Model: ${model}...`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ollama API Error (${response.status}): ${errorText}`);
            }

            const data: any = await response.json();
            return data.message.content;
        } catch (error) {
            console.error("❌ AI Generation Failed:", error);
            throw error;
        }
    }

    async generateJson<T>(model: string, messages: ChatMessage[], schema?: object): Promise<T> {
        try {
            const response = await this.chat(model, messages, {
                format: schema || "json", // Pass schema if supported, else "json"
                temperature: 0.2 // Lower temp for structured output
            });

            // Clean markdown code blocks if present
            const cleanJson = response.replace(/```json\n|\n```/g, "").trim();
            return JSON.parse(cleanJson) as T;
        } catch (error) {
            console.error("❌ Failed to parse JSON response:", error);
            throw error;
        }
    }
}

export const aiClient = new OllamaClient();
