import { useRef, useEffect } from "react";

export function useDebounce(callback, delay) {
  const callbackRef = useRef(callback);
  const timerRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFn = (...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };

  return debouncedFn;
}