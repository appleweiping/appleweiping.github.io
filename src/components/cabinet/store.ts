import { create } from "zustand";
import type { CabinetPhase } from "./types";

type PhaseUpdate = CabinetPhase | ((current: CabinetPhase) => CabinetPhase);

interface CabinetStore {
  phase: CabinetPhase;
  activeWing: string;
  selectedSlug: string | null;
  setPhase: (next: PhaseUpdate) => void;
  setActiveWing: (wing: string) => void;
  setSelectedSlug: (slug: string | null) => void;
}

export const useCabinetStore = create<CabinetStore>((set) => ({
  phase: "loading",
  activeWing: "ai-agents",
  selectedSlug: null,
  setPhase: (next) => set((state) => ({
    phase: typeof next === "function" ? next(state.phase) : next,
  })),
  setActiveWing: (activeWing) => set({ activeWing }),
  setSelectedSlug: (selectedSlug) => set({ selectedSlug }),
}));
