import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useAdapters } from '../../lib/assistant/AdaptersProvider';
import type { MemoryCategory, MemoryItem, MemorySummary, TrustedPerson } from '../../lib/assistant/types';

interface Props {
  summary?: MemorySummary;
  people: TrustedPerson[];
  onChanged: () => void;
}

const CATEGORIES: MemoryCategory[] = ['personal', 'farm', 'relational'];

/**
 * Anubandham memory & consent view. Everything is explicit and reversible:
 * sharing is off unless the farmer turns it on per person, sensitive values
 * stay masked until revealed, and every item can be removed.
 */
export function MemoryConsentPanel({ summary, people, onChanged }: Props) {
  const { t } = useI18n();
  const { maitri } = useAdapters();
  const [announcement, setAnnouncement] = useState('');

  if (!summary) return <p className="muted">{t('loading')}</p>;

  const run = async (action: Promise<void>, message?: string) => {
    await action;
    if (message) setAnnouncement(message);
    onChanged();
  };

  return (
    <div className="memory">
      <p>{t('memoryIntro')}</p>
      <p className="tag tag--demo">{t('memoryDemoNote')}</p>

      <div className="memory__setting">
        <button
          type="button"
          role="switch"
          aria-checked={summary.settings.rememberNewThings}
          className="switch"
          onClick={() => run(maitri.setRememberNewThings(!summary.settings.rememberNewThings))}
        >
          <span className="switch__track" aria-hidden="true"><span className="switch__thumb" /></span>
          <span>{t('rememberNew')}</span>
        </button>
        <p className="muted small">
          {summary.settings.rememberNewThings ? t('rememberOnHelp') : t('rememberOffHelp')}
        </p>
      </div>

      <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>

      {CATEGORIES.map((category) => {
        const items = summary.items.filter((i) => i.category === category);
        return (
          <section key={category} className="memory__group" aria-labelledby={`mem-${category}`}>
            <h3 id={`mem-${category}`}>{t(`category_${category}`)}</h3>
            {items.length === 0 ? (
              <p className="muted small">{t('nothingInCategory')}</p>
            ) : (
              <ul className="memory__list">
                {items.map((item) => (
                  <MemoryRow
                    key={item.id}
                    item={item}
                    people={people}
                    onRemove={() => run(maitri.removeMemory(item.id), t('removed', { label: item.label }))}
                    onForget={() => run(maitri.forgetAndBlock(item.id), t('forgotten', { label: item.label }))}
                    onShare={(ids) => run(maitri.setShareConsent(item.id, ids, ids.length > 0))}
                  />
                ))}
              </ul>
            )}
          </section>
        );
      })}

      {summary.doNotRemember.length > 0 && (
        <section className="memory__group" aria-labelledby="mem-blocked">
          <h3 id="mem-blocked">{t('doNotRememberTitle')}</h3>
          <ul className="plain-list">
            {summary.doNotRemember.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

interface RowProps {
  item: MemoryItem;
  people: TrustedPerson[];
  onRemove: () => void;
  onForget: () => void;
  onShare: (personIds: string[]) => void;
}

function MemoryRow({ item, people, onRemove, onForget, onShare }: RowProps) {
  const { t } = useI18n();
  const [revealed, setRevealed] = useState(false);
  const granted = item.shareConsent === 'granted' ? item.sharedWith : [];
  const sharedNames = people.filter((p) => granted.includes(p.id)).map((p) => p.displayName);
  const masked = item.sensitive && !revealed;

  const toggle = (personId: string, on: boolean) =>
    onShare(on ? [...granted, personId] : granted.filter((id) => id !== personId));

  return (
    <li className="memory-item">
      <p className="memory-item__label">{item.label}</p>
      <p className={masked ? 'muted' : undefined}>
        {masked ? t('sensitiveHidden') : item.value}
        {item.sensitive && (
          <button type="button" className="link-btn" onClick={() => setRevealed(!revealed)} aria-pressed={revealed}>
            {revealed ? t('hide') : t('show')}
          </button>
        )}
      </p>
      <p className="small">
        <span className="muted">{t('whyHelps')}: </span>
        {item.why}
      </p>
      <details className="memory-item__sharing">
        <summary>
          {t('sharing')}: {sharedNames.length > 0 ? t('sharedWith', { names: sharedNames.join(', ') }) : t('notShared')}
        </summary>
        <fieldset>
          <legend className="visually-hidden">{t('sharing')} — {item.label}</legend>
          {people.map((p) => (
            <label key={p.id} className="check">
              <input type="checkbox" checked={granted.includes(p.id)} onChange={(e) => toggle(p.id, e.target.checked)} />
              {t('allowShare', { name: p.displayName })}
            </label>
          ))}
        </fieldset>
      </details>
      <div className="actions">
        <button type="button" className="btn btn--ghost btn--small" onClick={onRemove}>
          {t('remove')}
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={onForget}>
          {t('dontRemember')}
        </button>
      </div>
    </li>
  );
}
