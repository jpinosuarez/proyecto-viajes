import { useRef, useEffect } from 'react';

export function useDebounce(value, delay, callback) {
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(value);
    }, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [value, delay, callback]);
}
