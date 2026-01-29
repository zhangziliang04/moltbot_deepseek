---
summary: "Configure DeepSeek (API V3)"
read_when:
  - You want to use DeepSeek V3 or DeepSeek Reasoner
  - You need copy/paste config for DeepSeek
---

# DeepSeek

DeepSeek provides an OpenAI-compatible API.

Supported models:
- `deepseek-chat` (DeepSeek V3)
- `deepseek-reasoner` (DeepSeek R1)

```bash
moltbot onboard --auth-choice deepseek-api-key
```

## Config snippet

```json5
{
  env: { DEEPSEEK_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "deepseek/deepseek-chat" },
      models: {
        "deepseek/deepseek-chat": { alias: "DeepSeek V3" },
        "deepseek/deepseek-reasoner": { alias: "DeepSeek R1" },
      },
    },
  },
  models: {
    providers: {
      deepseek: {
        baseUrl: "https://api.deepseek.com", // V3 endpoint
        api: "openai-completions",
        apiKey: "env:DEEPSEEK_API_KEY",
        models: [
          {
            id: "deepseek-chat",
            contextWindow: 64000,
            maxTokens: 8192,
            reasoning: false,
            cost: {
              input: 0.14,
              output: 0.28,
              cacheRead: 0.014,
              cacheWrite: 0.14
            },
          },
          {
            id: "deepseek-reasoner",
            contextWindow: 64000,
            maxTokens: 8192,
            reasoning: true,
            cost: {
              input: 0.55,
              output: 2.19,
              cacheRead: 0.14,
              cacheWrite: 0.55
            },
          },
        ],
      },
    },
  },
}
```

## Environment Variables

- `DEEPSEEK_API_KEY`: Your DeepSeek API key (sk-...).
