# span003

A large-type Spanish speaking practice app with 16 simple sentences using ser and estar. Listen to a model sentence, tap **Start recording**, read aloud, then tap **Finish recording**. Review a word-match score, highlighted words, the recognized transcript, and your own audio playback.

## Run locally

```sh
npm install
npm start
```

Open the localhost URL in Chrome. Microphone access requires localhost or HTTPS. Run `npm test` for scoring tests and `npm run build` to generate `dist/`.

## Speech and privacy

Uses browser SpeechRecognition (Spanish, es-MX), speech synthesis, and MediaRecorder. Browser speech recognition support varies; Chrome is the intended browser. An internet connection and microphone permission are needed. The browser may send audio to its speech service. Audio playback stays in memory and is discarded on navigation/reload; this app has no recording storage or backend. Recordings stop after two minutes as a safeguard.

Scores use word-level edit distance on the recognized transcript, ignoring punctuation, capitalization, and written accents. They measure recognized word agreement, not phonetic quality or accent. Speech-service errors can affect results. Missing/substituted words are highlighted; extra words lower the score.

## Deployment

GitHub Actions tests, builds, and deploys `dist/` to GitHub Pages on pushes to main. Set the repository’s Pages source to GitHub Actions. No API keys required.
