const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Fetch an AI-powered hint or trivia from the Gemini API.
 *
 * @param {string} apiKey - The user's Gemini API key.
 * @param {string} prompt - The hint request to send.
 * @param {object} [options]
 * @param {number} [options.temperature=0.7]
 * @returns {Promise<string>} The model's response text.
 */
export async function getGeminiHint(apiKey, prompt, options = {}) {
  if (!apiKey) {
    throw new Error('API key is required to fetch a hint.');
  }

  const temperature = options.temperature ?? 0.7;

  const res = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: 256,
      },
    }),
  });

  if (!res.ok) {
    let message = `Gemini API error (${res.status})`;

    if (res.status === 429) {
      message =
        'Rate limited by Gemini. Wait a moment, then try again. Free-tier keys have a limited number of requests per minute.';
    } else if (res.status === 403) {
      message =
        'Access denied. Your API key may be restricted or billing may not be enabled.';
    } else if (res.status === 400) {
      message = 'Bad request. The prompt may be too long or malformed.';
    } else if (res.status >= 500) {
      message = 'Gemini server error. Try again in a moment.';
    } else {
      const errBody = await res.text().catch(() => '');
      if (errBody) message += `: ${errBody}`;
    }

    throw new Error(message);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No hint returned.';
  return text;
}
