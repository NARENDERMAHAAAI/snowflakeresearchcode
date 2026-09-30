import { useI18n } from '../../i18n/I18nProvider';
import type { ContextSection, ConversationMessage as Message, TrustedPerson } from '../../lib/assistant/types';
import { MicIcon } from './icons';
import { ResponseBlocks } from './ResponseBlocks';
import { SECTION_LABEL } from './sections';

interface Props {
  message: Message;
  people: TrustedPerson[];
  onRetry: (id: string) => void;
  onShowSection: (section: ContextSection) => void;
  onConfirmReminder: (messageId: string, reminderId: string) => Promise<void>;
  onCancelReminder: (messageId: string, reminderId: string) => void;
}

const DOMAIN_LABEL = { nari: 'nariCapability', maitri: 'maitriCapability' } as const;

export function ConversationMessage({ message, people, onRetry, onShowSection, onConfirmReminder, onCancelReminder }: Props) {
  const { t } = useI18n();
  const time = new Date(message.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  if (message.role === 'farmer') {
    return (
      <li className="msg msg--farmer">
        <p className="visually-hidden">{t('you')}:</p>
        <div className="msg__bubble">
          {message.attachments?.map((a) => (
            <img key={a.id} src={a.previewUrl} alt={a.name} className="msg__image" />
          ))}
          {message.text && <p className="msg__text">{message.text}</p>}
        </div>
        <p className="msg__meta">
          {message.inputMode === 'voice' && (
            <>
              <MicIcon width={14} height={14} /> {t('viaVoice')} ·{' '}
            </>
          )}
          <time dateTime={message.createdAt}>{time}</time>
        </p>
      </li>
    );
  }

  return (
    <li className="msg msg--assistant" aria-busy={message.status === 'pending'}>
      <p className="msg__who">{t('assistant')}</p>
      <div className="msg__body">
        {message.status === 'pending' && (
          <p className="thinking" role="status">
            <span className="thinking__dots" aria-hidden="true"><span /><span /><span /></span>
            {t('thinking')}
          </p>
        )}
        {message.status === 'error' && (
          <div className="block block--notice is-warning" role="alert">
            <span>{t('sendFailed')}</span>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => onRetry(message.id)}>
              {t('retry')}
            </button>
          </div>
        )}
        {message.status === 'sent' && message.blocks && (
          <ResponseBlocks
            blocks={message.blocks}
            people={people}
            onConfirmReminder={(rid) => onConfirmReminder(message.id, rid)}
            onCancelReminder={(rid) => onCancelReminder(message.id, rid)}
          />
        )}
      </div>
      {message.status === 'sent' && (
        <div className="msg__meta msg__meta--assistant">
          {message.domains && message.domains.length > 0 && (
            <span className="msg__domains">
              {t('drewOn')}: {message.domains.map((d) => t(DOMAIN_LABEL[d])).join(' + ')}
            </span>
          )}
          {message.source === 'demo' && <span className="tag tag--demo">{t('demoTag')}</span>}
          <time dateTime={message.createdAt}>{time}</time>
          {message.related?.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => onShowSection(s)}>
              {t('seeRelated', { section: t(SECTION_LABEL[s]) })}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
