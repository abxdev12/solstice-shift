# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# AI
- Use gemini-3.1-flash-lite model for Gemini API calls. Confidence: 0.75
- Chess engine AI should calculate moves within 3-4 seconds while maintaining professional-level play quality. Confidence: 0.70

# Chess
- Use ELO-style difficulty tier labels with approximate ratings: Beginner (1500+), Intermediate (2000+), Advanced (2300+), Expert (2800+). Confidence: 0.80

# Layout
- Keep the Play tab minimal and scroll-free — avoid side panels like move history and AI analysis in the main game layout. Confidence: 0.70
- Place all control cards (New Game, Levels, Styles, Flip Board) in a single responsive horizontal row above the chessboard, not in a sidebar. Exclude turn/status info from the card row. Confidence: 0.75
- Use full-form labels for controls (e.g., "Beginner" not "B", "Intermediate" not "I") rather than abbreviated single-letter labels. Confidence: 0.65

# Navigation
- "Start Session" on the Home page should conditionally link based on apiKey: navigate to /play if key exists, otherwise to /api. After successfully saving a valid API key on the API page, auto-redirect to the Play tab after a 2-second timeout. Confidence: 0.75
- The Home tab should be the default selected tab when the server starts and the app first loads. Confidence: 0.75

# Theme
- Ensure piece colors contrast well against board backgrounds in all themes — especially Minimal (matte black pieces on near-black squares) and Neon (light pieces on light squares). Confidence: 0.70

