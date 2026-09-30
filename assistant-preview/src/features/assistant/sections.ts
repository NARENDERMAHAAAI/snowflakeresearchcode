import type { StringKey } from '../../i18n/strings';
import type { ContextSection } from '../../lib/assistant/types';

export const SECTION_LABEL = {
  farm: 'farmOverview',
  crop: 'cropHealth',
  sensors: 'fieldSensors',
  alerts: 'alerts',
  robot: 'robotStatus',
  tasks: 'todaysTasks',
  people: 'farmTeam',
  memory: 'memoryTitle',
} as const satisfies Record<ContextSection, StringKey>;

export const sectionElementId = (s: ContextSection) => `ctx-${s}`;
