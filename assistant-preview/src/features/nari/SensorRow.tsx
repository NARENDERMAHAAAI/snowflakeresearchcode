import { useI18n } from '../../i18n/I18nProvider';
import type { SensorReading } from '../../lib/assistant/types';

/**
 * One sensor line. A value is shown only for live/stale readings; otherwise
 * the row says plainly that nothing is available — never a guessed number.
 */
export function SensorRow({ reading }: { reading: SensorReading }) {
  const { t, relativeTime } = useI18n();
  const hasValue = (reading.state === 'live' || reading.state === 'stale') && reading.displayValue;
  return (
    <div className={`sensor sensor--${reading.state}`}>
      <span className="sensor__label">{t(`sensor_${reading.kind}`)}</span>
      <span className="sensor__value">{hasValue ? reading.displayValue : t('valueUnavailable')}</span>
      <span className={`state state--${reading.state}`}>
        <span className="state__dot" aria-hidden="true" />
        {t(`state_${reading.state}`)}
        {hasValue && reading.updatedAt ? ` · ${relativeTime(reading.updatedAt)}` : ''}
      </span>
    </div>
  );
}
