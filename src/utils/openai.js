/**
 * Call OpenAI API with a prompt
 * @param {string} prompt - The prompt to send to OpenAI
 * @param {string} apiKey - The OpenAI API key
 * @returns {Promise<string>} The response from OpenAI
 */
export async function callOpenAI(prompt, apiKey) {
  if (!apiKey) {
    throw new Error('API key is required. Please set it in Settings.');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to connect to OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI Error: ${error.message}`);
  }
}

/**
 * Test if the API key is valid
 * @param {string} apiKey - The OpenAI API key to test
 * @returns {Promise<boolean>} Whether the API key is valid
 */
export async function testAPIKey(apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Generate a summary from text
 * @param {string} text - The text to summarize
 * @param {string} length - The length of summary (short, medium, detailed)
 * @param {string} apiKey - The OpenAI API key
 * @returns {Promise<string>} The summary
 */
export async function generateSummary(text, length, apiKey) {
  const lengthInstructions = {
    short: 'in 3-5 bullet points',
    medium: 'in 7-10 bullet points with brief explanations',
    detailed: 'in a comprehensive format with sections, key points, and detailed explanations'
  };

  const prompt = `Please summarize the following study notes ${lengthInstructions[length]}. 
Focus on the most important concepts, key terms, and main ideas. Format with clear headings and bullet points.

Text to summarize:
${text}`;

  return await callOpenAI(prompt, apiKey);
}

/**
 * Generate flashcards from text
 * @param {string} text - The text to create flashcards from
 * @param {string} apiKey - The OpenAI API key
 * @returns {Promise<Array>} Array of flashcard objects with question and answer
 */
export async function generateFlashcards(text, apiKey) {
  const prompt = `Create 10-15 study flashcards from the following notes. 
Each flashcard should have a clear question on one side and a concise answer on the other.
Format your response as a JSON array with objects containing "question" and "answer" fields.
Make questions challenging but fair, covering key concepts.

Text:
${text}

Return ONLY the JSON array, no other text.`;

  const response = await callOpenAI(prompt, apiKey);
  
  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid response format');
  } catch (error) {
    throw new Error('Failed to parse flashcards. Please try again.');
  }
}

/**
 * Generate quiz questions from text
 * @param {string} text - The text to create quiz from
 * @param {number} numQuestions - Number of questions to generate
 * @param {string} apiKey - The OpenAI API key
 * @returns {Promise<Array>} Array of quiz question objects
 */
export async function generateQuiz(text, numQuestions, apiKey) {
  const prompt = `Create ${numQuestions} multiple choice quiz questions from the following study notes.
Each question should have:
- A clear question
- 4 options (A, B, C, D)
- The correct answer (letter)
- A brief explanation of why it's correct

Format your response as a JSON array with objects containing:
{
  "question": "...",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correctAnswer": "A",
  "explanation": "..."
}

Text:
${text}

Return ONLY the JSON array, no other text.`;

  const response = await callOpenAI(prompt, apiKey);
  
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid response format');
  } catch (error) {
    throw new Error('Failed to parse quiz questions. Please try again.');
  }
}
