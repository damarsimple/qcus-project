import { useRef } from 'react';

export const useScrollToBottom = () => {
  const containerRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return { containerRef, scrollToBottom };
};