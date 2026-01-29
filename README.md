## 安装依赖

node.js > 22.0



## From source (development)

Prefer `pnpm` for builds from source. Bun is optional for running TypeScript directly.

```bash
git clone https://github.com/moltbot/moltbot.git
cd moltbot

pnpm install
pnpm ui:build # auto-installs UI deps on first run
pnpm build

pnpm moltbot onboard --install-daemon

# Dev loop (auto-reload on TS changes)
pnpm gateway:watch
```

Note: `pnpm moltbot ...` runs TypeScript directly (via `tsx`). `pnpm build` produces `dist/` for running via Node / the packaged `moltbot` binary.


## TODO

（1）集成deepseek  - 已完成
（2）集成Ollama    - 进行中
