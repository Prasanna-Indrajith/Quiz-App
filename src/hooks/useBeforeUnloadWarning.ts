import { useEffect } from "react";

export function useBeforeUnloadWarning(isEnabled: boolean): void {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEnabled]);
}
