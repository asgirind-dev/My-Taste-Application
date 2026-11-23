import { useEffect, useState } from "react";
import { cloneSeed } from "../utils/helpers";

export function useDemoState() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem("mytaste-demo-v2");
      return raw ? JSON.parse(raw) : cloneSeed();
    } catch {
      return cloneSeed();
    }
  });

  useEffect(() => {
    localStorage.setItem("mytaste-demo-v2", JSON.stringify(state));
  }, [state]);

  return [state, setState];
}