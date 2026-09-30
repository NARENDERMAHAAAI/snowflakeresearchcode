import { useI18n } from '../../i18n/I18nProvider';
import type { ContextData } from '../../hooks/useContextData';
import type { ReactNode } from 'react';
import type { ContextSection } from '../../lib/assistant/types';
import { AlertIcon, LeafIcon, MemoryIcon, RobotIcon, TaskIcon } from './icons';

interface Props {
  data: ContextData;
  related: ContextSection[];
  onOpen: (section: ContextSection) => void;
}

/** Phone/tablet summary: horizontally scrollable status chips that open the full context sheet. */
export function ContextStrip({ data, related, onOpen }: Props) {
  const { t } = useI18n();
  const alerts = data.alerts.data ?? [];
  const safety = alerts.filter((a) => a.severity === 'safety').length;
  const openTasks = (data.tasks.data ?? []).filter((x) => !x.done).length;
  const online = (data.robots.data ?? []).filter((r) => r.connection === 'online').length;
  const robotsTotal = data.robots.data?.length ?? 0;

  const items: { section: ContextSection; icon: ReactNode; label: string; value: string }[] = [
    {
      section: 'crop',
      icon: <LeafIcon width={16} height={16} />,
      label: t('cropHealth'),
      value: data.crop.data ? t(`condition_${data.crop.data.condition}`) : '…',
    },
    {
      section: 'alerts',
      icon: <AlertIcon width={16} height={16} />,
      label: t('alerts'),
      value: safety > 0 ? `${alerts.length} · ${t('severity_safety')} ${safety}` : String(alerts.length),
    },
    { section: 'tasks', icon: <TaskIcon width={16} height={16} />, label: t('todaysTasks'), value: String(openTasks) },
    {
      section: 'robot',
      icon: <RobotIcon width={16} height={16} />,
      label: t('robotStatus'),
      value: `${online}/${robotsTotal} ${t('robot_online')}`,
    },
    { section: 'memory', icon: <MemoryIcon width={16} height={16} />, label: t('memoryTitle'), value: String(data.memory.data?.items.length ?? '…') },
  ];

  return (
    <nav className="ctx-strip" aria-label={t('openContext')}>
      <ul>
        {items.map((item) => (
          <li key={item.section}>
            <button
              type="button"
              className={`ctx-chip${related.includes(item.section) ? ' is-related' : ''}`}
              onClick={() => onOpen(item.section)}
              aria-haspopup="dialog"
            >
              {item.icon}
              <span className="ctx-chip__label">{item.label}</span>
              <span className="ctx-chip__value">{item.value}</span>
              {related.includes(item.section) && <span className="visually-hidden"> — {t('relatedNow')}</span>}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
