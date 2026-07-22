import { useEffect, useState } from "react";

export function useElapsedTimer(startedAt?: string, isRunning = false): number {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startedAt || !isRunning) {
      return;
    }

    const startedAtMs = Date.parse(startedAt);
    const update = () => {
      setElapsedSeconds(Math.floor((Date.now() - startedAtMs) / 1000));
    };

    update();
    const intervalId = window.setInterval(update, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning, startedAt]);

  return elapsedSeconds;
}
