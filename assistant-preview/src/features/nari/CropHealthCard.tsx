import { useI18n } from '../../i18n/I18nProvider';
import type { AsyncState } from '../../hooks/useAsync';
import type { CropHealth } from '../../lib/assistant/types';
import { ContextCard } from '../assistant/ContextCard';
import { LeafIcon } from '../assistant/icons';

export function CropHealthCard({ state, related }: { state: AsyncState<CropHealth>; related?: boolean }) {
  const { t, relativeTime } = useI18n();
  return (
    <ContextCard id="ctx-crop" title={t('cropHealth')} icon={<LeafIcon />} state={state} related={related}>
      {(crop) => (
        <>
          <p className={`condition condition--${crop.condition}`}>
            <span className="state__dot" aria-hidden="true" />
            {t(`condition_${crop.condition}`)}
          </p>
          <ul className="plain-list">
            {crop.observations.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <p className="muted small">
            {t('certainty', { level: t(`level_${crop.confidence}`) })} ·{' '}
            {t('lastReading', { time: relativeTime(crop.updatedAt) })}
          </p>
        </>
      )}
    </ContextCard>
  );
}
