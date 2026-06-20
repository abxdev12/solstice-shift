// Gemini keys start with "AIza" (legacy, 39 chars) or "AQ." (new format)
const GEMINI_KEY_REGEX = /^(AIza[0-9A-Za-z_-]{35}|AQ\.[A-Za-z0-9_-]{20,})$/;

export function isValidApiKey(str) {
  if (!str || typeof str !== 'string') return false;
  return GEMINI_KEY_REGEX.test(str.trim());
}
