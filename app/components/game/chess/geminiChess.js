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
  const prompt = `You are a chess commentator analysing a game between a human and an AI engine rated 2800+.

Current position (FEN): ${fen}
Last move: ${lastMove}

Give 1-2 sentences of strategic analysis of that last move. Mention if it was aggressive, defensive, tactical, or positional. Compare the human's play style to the engine's response. Keep it concise and insightful.`;

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
