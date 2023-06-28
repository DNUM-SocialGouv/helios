import { RefObject, useEffect, useRef } from "react";


export const useOutsideClick = (callback: () => void): RefObject<any> => {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, [ref]);
    return ref;
  };