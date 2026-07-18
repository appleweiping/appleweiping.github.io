import type { ProjectRecord } from "../../types/project";

export type CabinetLocale = "en" | "zh";
export type CabinetPhase = "loading" | "lobby" | "guided" | "free" | "project-modal";
export type CabinetView = "detecting" | "three" | "two";

export interface CabinetAppProps {
  projects: ProjectRecord[];
  locale?: CabinetLocale;
}

export interface CabinetCapabilities {
  webgl: boolean;
  mobile: boolean;
  lowPower: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  fallbackReasons: Array<"webgl" | "reduced-motion" | "save-data" | "low-power" | "context-lost">;
}
