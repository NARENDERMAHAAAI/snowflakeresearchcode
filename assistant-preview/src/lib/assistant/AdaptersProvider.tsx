import { createContext, useContext, type ReactNode } from 'react';
import type { AssistantAdapters } from './adapters';

const AdaptersContext = createContext<AssistantAdapters | null>(null);

/** Injects the adapter implementation (mock in the preview, real services later). */
export function AdaptersProvider({ adapters, children }: { adapters: AssistantAdapters; children: ReactNode }) {
  return <AdaptersContext.Provider value={adapters}>{children}</AdaptersContext.Provider>;
}

export function useAdapters(): AssistantAdapters {
  const ctx = useContext(AdaptersContext);
  if (!ctx) throw new Error('useAdapters must be used inside <AdaptersProvider>');
  return ctx;
}
