import { useId } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { ShieldIcon } from './icons';

/**
 * RAKSHA boundary. Rendered whenever a request involves physical action.
 * It intentionally has no handler that can reach a robot or machine: the
 * only button is disabled and exists to show where a real review would live.
 */
export function SafetyNotice({ action, reason }: { action: string; reason: string }) {
  const { t } = useI18n();
  const noteId = useId();
  return (
    <section className="safety" role="note" aria-label={t('rakshaTitle')}>
      <div className="safety__head">
        <ShieldIcon width={22} height={22} />
        <div>
          <p className="safety__title">{t('rakshaTitle')}</p>
          <p className="safety__subtitle">{t('rakshaSubtitle')}</p>
        </div>
      </div>
      <dl className="safety__facts">
        <div>
          <dt>{t('rakshaRequested')}</dt>
          <dd>{action}</dd>
        </div>
        <div>
          <dt>{t('rakshaWhy')}</dt>
          <dd>{reason}</dd>
        </div>
      </dl>
      <p className="safety__status">{t('rakshaNothingMoved')}</p>
      <button type="button" className="btn btn--ghost" disabled aria-describedby={noteId}>
        {t('rakshaOpenReview')}
      </button>
      <span id={noteId} className="muted small">{t('rakshaNotInPreview')}</span>
    </section>
  );
}
