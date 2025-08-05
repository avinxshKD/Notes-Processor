# StudyAI

A simple study tool I built to help me (and hopefully you lol) study better. It takes your notes and turns them into summaries, flashcards, and quizzes using OpenAI's API.

## What it does

- **Summarize notes** - Paste your notes or upload a PDF, get a clean summary
- **Generate flashcards** - Creates Q&A cards you can flip through
- **Quiz yourself** - Multiple choice questions to test what you've learned
- **Dark mode** - Because who doesn't need that

## Getting started

```bash
# Install dependencies
npm install

# Run it
npm run dev
```

Then open http://localhost:5173 in your browser.

## You'll need an OpenAI API key

Go to Settings and add your API key. You can get one from [OpenAI's platform](https://platform.openai.com/api-keys).

Don't worry - your key stays in your browser's local storage. Nothing gets sent to any server except OpenAI when you actually use the features.

## Tech stuff

- React + Vite
- Tailwind CSS v4
- pdfjs-dist for reading PDFs
- jspdf + file-saver for exports
- react-icons

## Known issues / TODO

- [ ] Large PDFs might be slow to parse
- [ ] Could add more quiz question types
- [ ] Maybe add spaced repetition for flashcards?

## License

MIT - do whatever you want with it
