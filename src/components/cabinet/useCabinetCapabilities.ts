import { useEffect, useState } from "react";
import type { CabinetCapabilities } from "./types";

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

const initialCapabilities: CabinetCapabilities = {
  webgl: false,
  mobile: false,
  lowPower: false,
  reducedMotion: false,
  saveData: false,
  fallbackReasons: [],
};

function webGlSupport(): { available: boolean; majorCaveat: boolean } {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true })
      ?? canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (context) return { available: true, majorCaveat: false };

    // A software/major-caveat context is still considered available so users
    // can explicitly try 3D, but it defaults to the reliable 2D collection.
    const fallbackCanvas = document.createElement("canvas");
    const fallbackContext = fallbackCanvas.getContext("webgl2") ?? fallbackCanvas.getContext("webgl");
    return { available: Boolean(fallbackContext), majorCaveat: Boolean(fallbackContext) };
  } catch {
    return { available: false, majorCaveat: false };
  }
}

function detectCapabilities(): CabinetCapabilities {
  const hintedNavigator = navigator as NavigatorWithHints;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 760;
  const saveData = Boolean(hintedNavigator.connection?.saveData);
  const deviceMemory = hintedNavigator.deviceMemory;
  const cores = hintedNavigator.hardwareConcurrency;
  const webglSupport = webGlSupport();
  const lowPower = (typeof deviceMemory === "number" && deviceMemory <= 2)
    || (typeof cores === "number" && cores <= 2)
    || webglSupport.majorCaveat;
  const webgl = webglSupport.available;
  const fallbackReasons: CabinetCapabilities["fallbackReasons"] = [];

  if (!webgl) fallbackReasons.push("webgl");
  if (reducedMotion) fallbackReasons.push("reduced-motion");
  if (saveData) fallbackReasons.push("save-data");
  if (lowPower) fallbackReasons.push("low-power");

  return { webgl, mobile, lowPower, reducedMotion, saveData, fallbackReasons };
}

export function useCabinetCapabilities() {
  const [capabilities, setCapabilities] = useState<CabinetCapabilities>(initialCapabilities);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    setCapabilities(detectCapabilities());
    setDetected(true);
  }, []);

  return { capabilities, detected, setCapabilities };
}
