import { useCallback, useEffect, useRef, useState } from "react";

interface UseToastResult {
  toastMessage: string | null;
  showToast: (message: string) => void;
}

export const useToast = (duration = 3000): UseToastResult => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback(
    (message: string) => {
      setToastMessage(message);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setToastMessage(null), duration);
    },
    [duration],
  );

  return { toastMessage, showToast };
};
