import { useMemo } from 'react';
import { UnifiedAssistantPage } from './features/assistant/UnifiedAssistantPage';
import { I18nProvider } from './i18n/I18nProvider';
import type { AssistantAdapters } from './lib/assistant/adapters';
import { AdaptersProvider } from './lib/assistant/AdaptersProvider';
import { createMockAdapters, type MockVoiceMode } from './lib/assistant/mock/mock-adapters';

export const ASSISTANT_ROUTE = '/assistant';

/** Preview-only QA switches, e.g. /assistant?voice=denied */
function mockOptionsFromUrl(search: string) {
  const params = new URLSearchParams(search);
  const voice = params.get('voice');
  const voiceMode: MockVoiceMode = voice === 'denied' || voice === 'unavailable' ? voice : 'ok';
  return { voiceMode };
}

export function App({ adapters }: { adapters?: AssistantAdapters }) {
  const resolved = useMemo(
    () => adapters ?? createMockAdapters(mockOptionsFromUrl(window.location.search)),
    [adapters],
  );
  return (
    <I18nProvider>
      <AdaptersProvider adapters={resolved}>
        <UnifiedAssistantPage />
      </AdaptersProvider>
    </I18nProvider>
  );
}
