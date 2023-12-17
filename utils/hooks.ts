import { UserContext } from '@/contexts/UserContext';
import { useContext, useEffect } from 'react';
import type { DependencyList, MutableRefObject, } from 'react';

export function useAsyncEffect(effect: () => Promise<void>, deps?: DependencyList) {
  useEffect(() => {
    effect();
  }, deps);
}

export function useOnClickOutside<
  T extends MutableRefObject<HTMLElement | null>,
  I extends MutableRefObject<HTMLElement | null> | undefined = undefined
>(options: {
  ref: T;
  ignoreRef?: I;
  onClick: () => void | Promise<void>;
}) {
  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        options.ref.current &&
        !options.ref.current.contains(event.target as Node) &&
        (!options.ignoreRef?.current || !options.ignoreRef.current.contains(event.target as Node))
      ) {
        options.onClick();
      }
    }

    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [options.ref]);
}

export function useUser() {
  return useContext(UserContext);
}
