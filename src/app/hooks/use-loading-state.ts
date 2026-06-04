import { useState, useEffect } from 'react';

export function useLoadingState(duration: number = 5000) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return { isLoading, setIsLoading };
}
