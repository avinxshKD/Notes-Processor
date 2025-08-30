# Notes Processor

Turns notes into summaries, flashcards, and quizzes. Upload a PDF or paste plain text, pick what you want, done.

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

## API Key

Needs an OpenAI key, add it in Settings. Stored in `localStorage`, never leaves your browser except for the actual API call.
Get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

## Stack

- React + Vite
- Tailwind CSS v4
- REST API (OpenAI)
- pdfjs-dist
- jspdf + file-saver
- react-icons

## License

MIT
