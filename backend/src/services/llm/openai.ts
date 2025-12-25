import { env } from "../../config/env";
import { chatMessge, chatOptions, LLMProvider } from "./provider";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(body: any, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("https://api.poenai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${env.LLM_API_KEY}  `,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
    return await res.json();
  } catch (error) {
    console.log(error);
  } finally {
    clearTimeout(t);
  }
}

export class OpenAIProvider implements LLMProvider {
  async chat(message: chatMessge[], opts: chatOptions): Promise<string> {
    const payload = {
      model: opts.model,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature ?? 0.6,
      message,
    };

    const delays = [0, 250, 1000];
    let lastErr: any;
    for (const d of delays) {
      if (d) await sleep(d);
      try {
        const data = await fetchWithTimeout(
          payload,
          opts.timeoutMs ?? env.REQUEST_TIMEOUT_MS
        );
        return data.choices?.[0]?.message?.content ?? "";
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr;
  }
}
