# GPT Live Co-Host

A dedicated workspace for building an AI co-host workflow for a Pump.fun livestream.

## Goal

- Read livestream chat messages from a supported, authorized source.
- Send selected messages to an AI backend for concise, natural English replies.
- Convert approved replies to speech.
- Route audio into PRISM Live Studio while the stream is sent to Pump.fun.

## Important architecture notes

- GitHub stores source code; it does not run the live co-host by itself.
- API credentials must stay on a backend/server environment, never in browser code or committed files.
- ChatGPT subscription access and API usage are separate.
- Pump.fun chat ingestion and PRISM audio routing must be verified before enabling automation.
- Start with a local/manual test mode before connecting live chat or broadcasting.

## Planned structure

- `frontend/` — simple operator dashboard and test controls.
- `backend/` — secure AI response service and chat/audio adapters.
- `docs/` — setup notes, safety limits, and integration checks.

No secrets, API keys, wallet seed phrases, or stream keys should be committed to this repository.
