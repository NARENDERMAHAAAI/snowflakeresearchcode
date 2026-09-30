import { useEffect, useState } from 'react';

export type AsyncState<T> =
  | { status: 'loading'; data?: T }
  | { status: 'ready'; data: T }
  | { status: 'error'; data?: T };

interface Settled<T> {
  key: string;
  ok: boolean;
  data?: T;
}

/**
 * Loads data from an adapter; keeps the last value while reloading.
 * `deps` must be serialisable primitives (e.g. locale, a version counter).
 */
export function useAsync<T>(load: () => Promise<T>, deps: readonly (string | number | boolean)[]): AsyncState<T> {
  const key = JSON.stringify(deps);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let active = true;
    load().then(
      (data) => active && setSettled({ key, ok: true, data }),
      () => active && setSettled((prev) => ({ key, ok: false, data: prev?.data })),
    );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload is keyed on `deps`
  }, [key]);

  if (!settled) return { status: 'loading' };
  if (settled.key !== key) return { status: 'loading', data: settled.data };
  return settled.ok ? { status: 'ready', data: settled.data as T } : { status: 'error', data: settled.data };
}
