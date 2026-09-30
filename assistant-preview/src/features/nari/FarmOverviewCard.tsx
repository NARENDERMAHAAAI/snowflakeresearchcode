import { useI18n } from '../../i18n/I18nProvider';
import type { AsyncState } from '../../hooks/useAsync';
import type { FarmStatus } from '../../lib/assistant/types';
import { ContextCard } from '../assistant/ContextCard';
import { LeafIcon } from '../assistant/icons';

export function FarmOverviewCard({ state, related }: { state: AsyncState<FarmStatus>; related?: boolean }) {
  const { t, relativeTime } = useI18n();
  return (
    <ContextCard id="ctx-farm" title={t('farmOverview')} icon={<LeafIcon />} state={state} related={related}>
      {(farm) => (
        <>
          <p className="ctx-card__lead">
            {farm.farmName}
            <span className="muted"> · {farm.location}</span>
          </p>
          <dl className="facts">
            <div><dt>{t('field')}</dt><dd>{farm.fieldName}</dd></div>
            <div><dt>{t('crop')}</dt><dd>{farm.crop}</dd></div>
            <div><dt>{t('growthStage')}</dt><dd>{farm.growthStage}</dd></div>
          </dl>
          <p className="muted small">{t('synced', { time: relativeTime(farm.updatedAt) })}</p>
        </>
      )}
    </ContextCard>
  );
}
