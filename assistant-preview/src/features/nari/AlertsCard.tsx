import { useI18n } from '../../i18n/I18nProvider';
import type { AsyncState } from '../../hooks/useAsync';
import type { AlertSeverity, FarmAlert } from '../../lib/assistant/types';
import { ContextCard } from '../assistant/ContextCard';
import { AlertIcon, InfoIcon, ShieldIcon } from '../assistant/icons';

const ORDER: AlertSeverity[] = ['safety', 'warning', 'attention', 'info'];
const ICON = { safety: ShieldIcon, warning: AlertIcon, attention: AlertIcon, info: InfoIcon } as const;

export function sortAlerts(alerts: FarmAlert[]): FarmAlert[] {
  return [...alerts].sort((a, b) => ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity));
}

export function AlertsCard({ state, related }: { state: AsyncState<FarmAlert[]>; related?: boolean }) {
  const { t, relativeTime } = useI18n();
  return (
    <ContextCard id="ctx-alerts" title={t('alerts')} icon={<AlertIcon />} state={state} related={related}>
      {(alerts) =>
        alerts.length === 0 ? (
          <p className="muted">{t('noAlerts')}</p>
        ) : (
          <ul className="alert-list">
            {sortAlerts(alerts).map((a) => {
              const Icon = ICON[a.severity];
              return (
                <li key={a.id} className={`alert alert--${a.severity}`}>
                  <Icon width={18} height={18} />
                  <div>
                    <p className="alert__title">
                      <span className="alert__severity">{t(`severity_${a.severity}`)}</span> {a.title}
                    </p>
                    <p className="alert__detail">{a.detail}</p>
                    <p className="muted small">{relativeTime(a.updatedAt)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )
      }
    </ContextCard>
  );
}
