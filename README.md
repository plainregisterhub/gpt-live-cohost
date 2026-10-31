# GPT Live Co-Host

A mobile-first browser proof of concept for an English-speaking AI co-host for the $DAYONE / Devs In Hoodies (DIH) livestream.

## What this version does

- Provides a responsive operator dashboard.
- Accepts typed viewer messages, host instructions, or a quiet-chat topic request.
- Uses browser Speech Recognition where supported to transcribe Malay speech into the input box.
- Sends the selected input mode to a backend AI endpoint.
- Reads the generated English line aloud with browser text-to-speech.
- Keeps the OpenAI API key on the backend, never in frontend code.

## What is not connected yet

- Automatic Pump.fun livestream chat ingestion.
- Automatic microphone listening while live.
- Automatic audio routing from this browser into Pump.fun or PRISM.
- A one-button autonomous live host.

Browser speech recognition and speech synthesis availability vary by browser, device, language support, permissions, and network. Speech synthesis playing in a browser tab does not mean the audio is being broadcast to Pump.fun.

## Run locally

Requires Node.js 20 or newer.

1. Copy `.env.example` to `.env`.
2. Add a valid API key to `OPENAI_API_KEY` in `.env`.
3. Optionally set `OPENAI_MODEL` to a model available to your API account.
4. Run `npm install` then `npm start`.
5. Open `http://localhost:3000`.

Never commit `.env`, API keys, wallet seed phrases, or stream keys. GitHub Pages alone cannot run this Node backend or securely store API keys. OpenAI API usage is billed separately from a ChatGPT subscription; check current pricing and limits before use.

## Verified project context currently included

- The token is referred to as $DAYONE and is associated with Pump.fun.
- The project has used the name/narrative Devs In Hoodies (DIH).

Supply, tokenomics, utility, market figures, roadmap, wallet addresses, listings, and partnerships are deliberately not guessed. Add only confirmed facts to the backend prompt.

## Next integration gates

1. Test the dashboard and browser voice input on the target Android phone.
2. Choose a supported, authorized source for livestream chat. Do not assume scraping or an undocumented endpoint will be stable.
3. Verify a reliable audio path into the actual livestream, using the available streaming setup.
4. Add an explicit operator pause/mute control before any automatic speech is allowed live.
