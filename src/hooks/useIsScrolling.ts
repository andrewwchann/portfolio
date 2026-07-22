import { useEffect, useState } from "react";

/**
 * Shared "is the user actively scrolling?" state.
 *
 * A single passive scroll listener is installed for the whole app (lazily, on
 * first subscriber) and fans out to every consumer. This lets components pause
 * expensive per-frame work (e.g. autoplaying videos) while scrolling and resume
 * shortly after the user stops, without each component wiring up its own
 * listener + idle timer.
 */

const IDLE_MS = 180;

let scrolling = false;
let idleTimer = 0;
let initialized = false;
const listeners = new Set<(value: boolean) => void>();

function emit() {
  for (const listener of listeners) listener(scrolling);
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const onScroll = () => {
    if (!scrolling) {
      scrolling = true;
      emit();
    }
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      scrolling = false;
      emit();
    }, IDLE_MS);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

export function useIsScrolling(): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    ensureInitialized();
    listeners.add(setValue);
    setValue(scrolling);
    return () => {
      listeners.delete(setValue);
    };
  }, []);

  return value;
}
