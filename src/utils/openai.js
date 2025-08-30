function normalizeApiKey(apiKey) {
  if (!apiKey) return '';
  return apiKey.trim().replace(/^['"]|['"]$/g, '');
}

async function callOpenAI(prompt, apiKey) {
  const cleanKey = normalizeApiKey(apiKey);
  if (!cleanKey) throw new Error('API key is required. Set it in Settings.');

  const models = ['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-3.5-turbo'];
  let lastError = null;

  for (const model of models) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    }

    const err = await res.json().catch(() => ({}));
    const message = err.error?.message || `OpenAI returned ${res.status}`;
    lastError = message;

    const shouldTryAnotherModel =
      res.status === 404 ||
      message.toLowerCase().includes('model') ||
      message.toLowerCase().includes('does not exist');

    if (!shouldTryAnotherModel) {
      throw new Error(message);
    }
  }

  throw new Error(lastError || 'Failed to generate response from OpenAI.');
}

export async function testAPIKey(apiKey) {
  const cleanKey = normalizeApiKey(apiKey);
  if (!cleanKey) return false;

  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${cleanKey}` }
    });
    return res.ok;
  } catch {
    return false;
  }
}

const SUMMARY_DEPTH = {
  short: 'in 3-5 bullet points',
  medium: 'in 7-10 bullet points with brief explanations',
  detailed: 'in a comprehensive format with sections, key points, and detailed explanations'
};

export async function generateSummary(text, length, apiKey) {
  const prompt = `Summarize these study notes ${SUMMARY_DEPTH[length]}.
Focus on key concepts, terms, and main ideas. Use clear headings and bullet points.

${text}`;

  return callOpenAI(prompt, apiKey);
}

function extractJSON(raw) {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('API returned garbage — no JSON array found');
  return JSON.parse(match[0]);
}

export async function generateFlashcards(text, apiKey) {
  const prompt = `Create 10-15 flashcards from these notes.
Each card: {"question": "...", "answer": "..."}
Challenging but fair. Return ONLY a JSON array.

${text}`;

  const raw = await callOpenAI(prompt, apiKey);
  try {
    return extractJSON(raw);
  } catch {
    throw new Error('Failed to parse flashcards. Try again.');
  }
}

export async function generateQuiz(text, numQuestions, apiKey) {
  const prompt = `Create ${numQuestions} MCQs from these notes.
Each: {"question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correctAnswer": "A", "explanation": "..."}
Return ONLY a JSON array.

${text}`;

  const raw = await callOpenAI(prompt, apiKey);
  try {
    return extractJSON(raw);
  } catch {
    throw new Error('Failed to parse quiz. Try again.');
  }
}
