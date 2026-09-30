import { useEffect } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import type { ContextData } from '../../hooks/useContextData';
import type { ContextSection } from '../../lib/assistant/types';
import { MemorySummaryCard } from '../maitri/MemorySummaryCard';
import { TodayTasksCard } from '../maitri/TodayTasksCard';
import { TrustedPeopleCard } from '../maitri/TrustedPeopleCard';
import { AlertsCard } from '../nari/AlertsCard';
import { CropHealthCard } from '../nari/CropHealthCard';
import { FarmOverviewCard } from '../nari/FarmOverviewCard';
import { RobotStatusCard } from '../nari/RobotStatusCard';
import { SensorsCard } from '../nari/SensorsCard';
import { sectionElementId } from './sections';

export interface FocusRequest {
  section: ContextSection;
  nonce: number;
}

interface Props {
  data: ContextData;
  related: ContextSection[];
  focus: FocusRequest | null;
  onOpenMemory: () => void;
  showTitle?: boolean;
}

/** Supporting farm & people context. Composes NARI and MAITRI cards side by side. */
export function ContextPanel({ data, related, focus, onOpenMemory, showTitle = true }: Props) {
  const { t } = useI18n();
  const is = (s: ContextSection) => related.includes(s);
  const people = data.people.data ?? [];

  useEffect(() => {
    if (!focus) return;
    const el = document.getElementById(sectionElementId(focus.section));
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView?.({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  }, [focus]);

  return (
    <div className="ctx-panel">
      {showTitle && <h2 className="ctx-panel__title">{t('contextTitle')}</h2>}
      <FarmOverviewCard state={data.farm} related={is('farm')} />
      <CropHealthCard state={data.crop} related={is('crop')} />
      <AlertsCard state={data.alerts} related={is('alerts')} />
      <TodayTasksCard state={data.tasks} people={people} related={is('tasks')} />
      <SensorsCard state={data.sensors} related={is('sensors')} />
      <RobotStatusCard state={data.robots} related={is('robot')} />
      <TrustedPeopleCard state={data.people} related={is('people')} />
      <MemorySummaryCard state={data.memory} related={is('memory')} onOpen={onOpenMemory} />
    </div>
  );
}
