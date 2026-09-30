import { useI18n } from '../../i18n/I18nProvider';
import type { AsyncState } from '../../hooks/useAsync';
import type { StringKey } from '../../i18n/strings';
import type { RobotStatus, SafetyState } from '../../lib/assistant/types';
import { ContextCard } from '../assistant/ContextCard';
import { RobotIcon } from '../assistant/icons';

const SAFETY_LABEL = {
  'safe-idle': 'safety_safe_idle',
  'review-required': 'safety_review_required',
  stopped: 'safety_stopped',
  unknown: 'safety_unknown',
} as const satisfies Record<SafetyState, StringKey>;

/** Read-only robot status. There are deliberately no controls here. */
export function RobotStatusCard({ state, related }: { state: AsyncState<RobotStatus[]>; related?: boolean }) {
  const { t, relativeTime } = useI18n();
  return (
    <ContextCard id="ctx-robot" title={t('robotStatus')} icon={<RobotIcon />} state={state} related={related}>
      {(robots) => (
        <>
          <ul className="robot-list">
            {robots.map((r) => (
              <li key={r.id} className="robot">
                <div className="robot__row">
                  <span className="robot__name">{r.name}</span>
                  <span className={`state state--${r.connection === 'online' ? 'live' : 'unavailable'}`}>
                    <span className="state__dot" aria-hidden="true" />
                    {t(`robot_${r.connection}`)}
                  </span>
                </div>
                <p className="small">
                  {t(`power_${r.power}`)} · {r.assignment ?? t('noAssignment')}
                </p>
                <p className={`small robot__safety robot__safety--${r.safety}`}>
                  {t(SAFETY_LABEL[r.safety])} · {relativeTime(r.updatedAt)}
                </p>
              </li>
            ))}
          </ul>
          <p className="muted small">{t('robotReadOnly')}</p>
        </>
      )}
    </ContextCard>
  );
}
