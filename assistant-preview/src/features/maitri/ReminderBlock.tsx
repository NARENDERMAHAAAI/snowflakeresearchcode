import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import type { Reminder, TrustedPerson } from '../../lib/assistant/types';
import { CheckIcon } from '../assistant/icons';

interface Props {
  reminder: Reminder;
  person?: TrustedPerson;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

/**
 * Reminder proposal. Nothing is created until the farmer taps Confirm, and in
 * the preview a confirmed reminder is stored locally only — no one is messaged.
 */
export function ReminderBlock({ reminder, person, onConfirm, onCancel }: Props) {
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const name = person?.displayName ?? '—';

  const confirm = async () => {
    setSaving(true);
    try {
      await onConfirm();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`block block--reminder is-${reminder.status}`} aria-label={t('reminder')}>
      <p className="block__eyebrow">{t('reminder')}</p>
      <dl className="facts">
        <div><dt>{t('reminderFor')}</dt><dd>{name}</dd></div>
        <div><dt>{t('reminderWhen')}</dt><dd>{reminder.whenLabel}</dd></div>
        <div><dt>{t('reminderTask')}</dt><dd>{reminder.task}</dd></div>
      </dl>
      <p className="muted small">{t('reminderPreviewNote', { name })}</p>
      <div role="status" aria-live="polite">
        {reminder.status === 'confirmed' && (
          <p className="reminder__done">
            <CheckIcon width={16} height={16} /> {t('reminderConfirmed')}
          </p>
        )}
        {reminder.status === 'cancelled' && <p className="muted">{t('reminderCancelled')}</p>}
      </div>
      {reminder.status === 'proposed' && (
        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={confirm} disabled={saving}>
            {saving ? t('reminderSaving') : t('reminderConfirm')}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={saving}>
            {t('reminderCancel')}
          </button>
        </div>
      )}
    </section>
  );
}
