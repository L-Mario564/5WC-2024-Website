// import { UserContext } from '@/contexts/UserContext';
import { useContext, useEffect } from 'react';
import type { DependencyList, EffectCallback } from 'react';

export function useAsyncEffect(effect: () => Promise<ReturnType<EffectCallback>>, deps?: DependencyList) {
  useEffect(() => {
    effect();
  }, deps);
}

// export function useUser() {
//   return useContext(UserContext);
// }
