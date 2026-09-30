import { useI18n } from '../../i18n/I18nProvider';
import type { AsyncState } from '../../hooks/useAsync';
import type { MemorySummary } from '../../lib/assistant/types';
import { ContextCard } from '../assistant/ContextCard';
import { MemoryIcon } from '../assistant/icons';

interface Props {
  state: AsyncState<MemorySummary>;
  related?: boolean;
  onOpen: () => void;
}

/** Compact entry point into the memory & consent view. Never shows memory values. */
export function MemorySummaryCard({ state, related, onOpen }: Props) {
  const { t } = useI18n();
  return (
    <ContextCard id="ctx-memory" title={t('memoryTitle')} icon={<MemoryIcon />} state={state} related={related}>
      {(summary) => (
        <>
          <p>{t('memorySummary', { count: summary.items.length })}</p>
          <p className="muted small">
            {summary.settings.rememberNewThings ? t('rememberOnHelp') : t('rememberOffHelp')}
          </p>
          <button type="button" className="btn btn--secondary" onClick={onOpen} aria-haspopup="dialog">
            {t('memoryReview')}
          </button>
        </>
      )}
    </ContextCard>
  );
}
