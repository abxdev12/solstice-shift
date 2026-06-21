const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Ask Gemini for strategic commentary on the current position.
 * @param {string} apiKey
 * @param {string} fen
 * @param {string} lastMove
 * @returns {Promise<string>}
 */
export async function getChessCommentary(apiKey, fen, lastMove) {
  const prompt = `You are a friendly chess coach. Look at this chess position.

Current position (FEN): ${fen}
Last move: ${lastMove}

Explain that last move in simple everyday language — just 2 sentences. Say what it does and whether it's attacking or defending. Keep it easy to understand, like you're teaching a friend.`;

  const res = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 200 },
    }),
  });

  if (!res.ok) {
    let msg = `Gemini API error (${res.status})`;
    if (res.status === 429) msg = 'Rate limited by Gemini. Try again in a moment.';
    else if (res.status === 403) msg = 'Access denied. Check your API key.';
    else {
      const body = await res.text().catch(() => '');
      if (body) msg += `: ${body}`;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No analysis available.';
}
