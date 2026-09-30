import { useAdapters } from '../lib/assistant/AdaptersProvider';
import type { Locale } from '../lib/assistant/types';
import { useAsync } from './useAsync';

/**
 * Loads every context-panel resource independently so one unavailable
 * service never blanks the whole panel. `version` forces a refresh after
 * the farmer changes something (reminder confirmed, memory edited).
 */
export function useContextData(locale: Locale, version: number) {
  const { nari, maitri } = useAdapters();
  const opts = { locale };
  const deps = [locale, version];
  return {
    farm: useAsync(() => nari.getFarmStatus(opts), deps),
    crop: useAsync(() => nari.getCropHealth(opts), deps),
    sensors: useAsync(() => nari.getSensorReadings(opts), deps),
    alerts: useAsync(() => nari.getAlerts(opts), deps),
    robots: useAsync(() => nari.getRobotStatus(opts), deps),
    people: useAsync(() => maitri.getTrustedPeople(opts), deps),
    tasks: useAsync(() => maitri.getTodayTasks(opts), deps),
    memory: useAsync(() => maitri.getMemorySummary(opts), deps),
  };
}

export type ContextData = ReturnType<typeof useContextData>;
