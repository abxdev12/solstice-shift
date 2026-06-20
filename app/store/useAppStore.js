'use client';

import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // --- API Key ---
  apiKey: '',

  // --- UI State ---
  isPlayLocked: true,

  // --- Persistent game state (survives tab switches) ---
  savedFen: '',
  savedLastMove: null,

  // --- Actions ---
  setApiKey: (key) =>
    set({
      apiKey: key,
      isPlayLocked: !key || key.length === 0,
    }),

  saveGame: (fen, lastMove) => set({ savedFen: fen, savedLastMove: lastMove }),

  clearSavedGame: () => set({ savedFen: '', savedLastMove: null }),
}));

export default useAppStore;
