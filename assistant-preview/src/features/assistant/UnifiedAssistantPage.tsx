import { useCallback, useMemo, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useContextData } from '../../hooks/useContextData';
import { useConversation } from '../../hooks/useConversation';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useAdapters } from '../../lib/assistant/AdaptersProvider';
import type { ContextSection } from '../../lib/assistant/types';
import { MemoryConsentPanel } from '../maitri/MemoryConsentPanel';
import { AssistantComposer } from './AssistantComposer';
import { AssistantHeader } from './AssistantHeader';
import { ContextPanel, type FocusRequest } from './ContextPanel';
import { ContextStrip } from './ContextStrip';
import { ConversationTimeline } from './ConversationTimeline';
import { Sheet } from './Sheet';

export const WIDE_QUERY = '(min-width: 1024px)';

/**
 * /assistant — one page, one conversation. NARI and MAITRI contribute behind
 * the ConversationAdapter; the farmer never switches assistants or modes.
 */
export function UnifiedAssistantPage() {
  const { t, locale } = useI18n();
  const { voice } = useAdapters();
  const wide = useMediaQuery(WIDE_QUERY);
  const online = useOnlineStatus();

  const [version, setVersion] = useState(0);
  const refreshContext = useCallback(() => setVersion((v) => v + 1), []);
  const data = useContextData(locale, version);
  const convo = useConversation(locale, refreshContext);

  const [contextOpen, setContextOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [focus, setFocus] = useState<FocusRequest | null>(null);

  const related = useMemo<ContextSection[]>(() => {
    const last = [...convo.messages].reverse().find((m) => m.role === 'assistant' && m.status === 'sent');
    return last?.related ?? [];
  }, [convo.messages]);

  const lastFarmer = [...convo.messages].reverse().find((m) => m.role === 'farmer');

  const showSection = (section: ContextSection) => {
    if (section === 'memory' && !wide) {
      setMemoryOpen(true);
      return;
    }
    if (!wide) setContextOpen(true);
    setFocus({ section, nonce: Date.now() });
  };

  const panel = (
    <ContextPanel
      data={data}
      related={related}
      focus={focus}
      showTitle={wide}
      onOpenMemory={() => {
        setContextOpen(false);
        setMemoryOpen(true);
      }}
    />
  );

  return (
    <div className="app">
      <a className="skip-link" href="#composer-input">
        {t('skipToComposer')}
      </a>
      <AssistantHeader farm={data.farm.data} showContextButton={!wide} onOpenContext={() => setContextOpen(true)} />

      <div className="workspace">
        <main className="conversation-col">
          {!wide && <ContextStrip data={data} related={related} onOpen={showSection} />}
          <ConversationTimeline
            messages={convo.messages}
            people={data.people.data ?? []}
            onPickScenario={(text) => convo.send({ text, inputMode: 'text', attachments: [] })}
            onRetry={convo.retry}
            onShowSection={showSection}
            onConfirmReminder={convo.confirmReminder}
            onCancelReminder={convo.cancelReminder}
          />
          <AssistantComposer
            voice={voice}
            busy={convo.pending}
            online={online}
            lastWasVoice={lastFarmer?.inputMode === 'voice'}
            onSend={convo.send}
          />
        </main>

        {wide && (
          <aside className="context-col" aria-label={t('contextTitle')}>
            {panel}
          </aside>
        )}
      </div>

      {!wide && (
        <Sheet open={contextOpen} onClose={() => setContextOpen(false)} title={t('contextTitle')} variant="bottom">
          {panel}
        </Sheet>
      )}

      <Sheet open={memoryOpen} onClose={() => setMemoryOpen(false)} title={t('memoryTitle')}>
        <MemoryConsentPanel summary={data.memory.data} people={data.people.data ?? []} onChanged={refreshContext} />
      </Sheet>
    </div>
  );
}
