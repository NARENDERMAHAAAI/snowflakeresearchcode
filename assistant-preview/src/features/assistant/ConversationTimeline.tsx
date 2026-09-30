import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import type { StringKey } from '../../i18n/strings';
import type { ContextSection, ConversationMessage as Message, TrustedPerson } from '../../lib/assistant/types';
import { ConversationMessage } from './ConversationMessage';

const SCENARIOS: StringKey[] = ['scenarioCrop', 'scenarioReminder', 'scenarioCombined', 'scenarioMoisture', 'scenarioRobot'];

interface Props {
  messages: Message[];
  people: TrustedPerson[];
  onPickScenario: (text: string) => void;
  onRetry: (id: string) => void;
  onShowSection: (section: ContextSection) => void;
  onConfirmReminder: (messageId: string, reminderId: string) => Promise<void>;
  onCancelReminder: (messageId: string, reminderId: string) => void;
}

export function ConversationTimeline({ messages, onPickScenario, ...rest }: Props) {
  const { t } = useI18n();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    endRef.current?.scrollIntoView?.({ behavior: reduce ? 'auto' : 'smooth', block: 'end' });
  }, [messages]);

  return (
    <section className="timeline" aria-label={t('conversation')}>
      {messages.length === 0 ? (
        <div className="empty">
          <h1 className="empty__title">{t('emptyTitle')}</h1>
          <p className="empty__body">{t('emptyBody')}</p>
          <p className="empty__try">{t('tryAsking')}</p>
          <ul className="suggestions">
            {SCENARIOS.map((key) => (
              <li key={key}>
                <button type="button" className="suggestion" onClick={() => onPickScenario(t(key))}>
                  {t(key)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
        <h1 className="visually-hidden">{t('conversation')}</h1>
        <ol className="timeline__list" aria-live="polite" aria-relevant="additions">
          {messages.map((m) => (
            <ConversationMessage key={m.id} message={m} {...rest} />
          ))}
        </ol>
        </>
      )}
      <div ref={endRef} />
    </section>
  );
}
