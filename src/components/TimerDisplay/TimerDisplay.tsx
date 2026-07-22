import { formatElapsedSeconds } from "../../utils/date";

interface TimerDisplayProps {
  elapsedSeconds: number;
}

export function TimerDisplay({ elapsedSeconds }: TimerDisplayProps) {
  return <time>{formatElapsedSeconds(elapsedSeconds)}</time>;
}
