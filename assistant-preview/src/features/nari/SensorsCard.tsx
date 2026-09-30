import { useI18n } from '../../i18n/I18nProvider';
import type { AsyncState } from '../../hooks/useAsync';
import type { SensorReading } from '../../lib/assistant/types';
import { ContextCard } from '../assistant/ContextCard';
import { SensorIcon } from '../assistant/icons';
import { SensorRow } from './SensorRow';

export function SensorsCard({ state, related }: { state: AsyncState<SensorReading[]>; related?: boolean }) {
  const { t } = useI18n();
  return (
    <ContextCard id="ctx-sensors" title={t('fieldSensors')} icon={<SensorIcon />} state={state} related={related}>
      {(readings) => (
        <div className="sensor-list">
          {readings.map((r) => (
            <SensorRow key={r.id} reading={r} />
          ))}
        </div>
      )}
    </ContextCard>
  );
}
