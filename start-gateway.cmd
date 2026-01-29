@echo off
set CLAWDBOT_GATEWAY_TOKEN=0f73c767a48bb5f25deed6a93278f7a94627f52d2334d5ef
set CLAWDBOT_GATEWAY_PORT=18789
echo Starting Moltbot Gateway...
echo.
echo URL: http://127.0.0.1:18789/?token=%CLAWDBOT_GATEWAY_TOKEN%
echo.
node dist/index.js gateway run --force
pause
