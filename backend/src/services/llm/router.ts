import { env } from "../../config/env";
import { OpenAIProvider } from "./openai";
import type { LLMProvider } from "./provider";

class MockProvider implements LLMProvider {
  async chat() { return "Mock reply. Set LLM_PROVIDER=openai to enable real answers."; }
}

export function getLLM(): LLMProvider {
  return env.LLM_PROVIDER === "openai" ? new OpenAIProvider() : new MockProvider();
}
