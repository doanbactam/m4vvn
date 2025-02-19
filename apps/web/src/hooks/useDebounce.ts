import { useState, useEffect } from "react";

/**
 * useDebounce - Hook giúp trì hoãn giá trị đầu vào (debounce)
 * @param value Giá trị đầu vào
 * @param delay Thời gian trễ (ms)
 * @returns Giá trị đã debounce
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
