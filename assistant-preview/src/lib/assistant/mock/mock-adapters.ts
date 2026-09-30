/**
 * Inert, in-memory implementations of the assistant adapters for the preview.
 *
 * - No network requests, no timers that outlive the page, no real devices.
 * - Reminders are recorded locally only; nobody is messaged.
 * - The voice mock never opens the microphone; it replays a scripted phrase.
 */
import type {
  AssistantAdapters,
  ConversationAdapter,
  MaitriAdapter,
  NariAdapter,
  VoiceAdapter,
  VoiceEvent,
} from '../adapters';
import type { Locale, MemoryItem, Reminder } from '../types';
import { runDemoScript } from './demo-script';
import {
  demoAlerts,
  demoCropHealth,
  demoFarm,
  demoMemory,
  demoPeople,
  demoRobots,
  demoSensors,
  demoTasks,
} from './mock-data';

export type MockVoiceMode = 'ok' | 'denied' | 'unavailable';

export interface MockOptions {
  /** Simulated service latency; use 0 in tests. */
  latencyMs?: number;
  voiceMode?: MockVoiceMode;
}

const wait = (ms: number) => (ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve());

function createNari(latency: number): NariAdapter {
  return {
    getFarmStatus: async ({ locale }) => (await wait(latency), demoFarm(locale)),
    getCropHealth: async ({ locale }) => (await wait(latency), demoCropHealth(locale)),
    getSensorReadings: async ({ locale }) => (await wait(latency), demoSensors(locale)),
    getAlerts: async ({ locale }) => (await wait(latency), demoAlerts(locale)),
    getRobotStatus: async ({ locale }) => (await wait(latency), demoRobots(locale)),
  };
}

function createMaitri(latency: number): MaitriAdapter {
  // Local, per-page state standing in for the MAITRI service.
  const removed = new Set<string>();
  const blocked: string[] = [];
  const consent = new Map<string, Pick<MemoryItem, 'sharedWith' | 'shareConsent'>>();
  const reminders: Reminder[] = [];
  let rememberNewThings = true;
  const memory = (locale: Locale) =>
    demoMemory(locale)
      .filter((m) => !removed.has(m.id))
      .map((m) => ({ ...m, ...consent.get(m.id) }));

  return {
    async getMaitriContext() {
      await wait(latency);
      return { preferredLanguage: 'en', rememberNewThings, rememberConsentRecordedAt: '2026-09-12T08:00:00Z' };
    },
    getTrustedPeople: async ({ locale }) => (await wait(latency), demoPeople(locale)),
    async getTodayTasks({ locale }) {
      await wait(latency);
      const fromReminders = reminders
        .filter((r) => r.status === 'confirmed')
        .map((r) => ({
          id: r.id,
          title: r.task,
          due: 'tomorrow' as const,
          dueLabel: r.whenLabel,
          origin: 'reminder' as const,
          assigneeId: r.personId,
          done: false,
          source: 'demo' as const,
        }));
      return [...demoTasks(locale), ...fromReminders];
    },
    async getMemorySummary({ locale }) {
      await wait(latency);
      return {
        settings: { preferredLanguage: locale, rememberNewThings },
        items: memory(locale),
        doNotRemember: demoMemory(locale)
          .filter((m) => blocked.includes(m.id))
          .map((m) => m.label),
      };
    },
    async createReminder(reminder) {
      await wait(latency);
      const confirmed: Reminder = { ...reminder, status: 'confirmed' };
      reminders.push(confirmed);
      return confirmed;
    },
    async removeMemory(id) {
      await wait(latency);
      removed.add(id);
    },
    async forgetAndBlock(id) {
      await wait(latency);
      removed.add(id);
      if (!blocked.includes(id)) blocked.push(id);
    },
    async setShareConsent(id, personIds, granted) {
      await wait(latency);
      consent.set(id, { sharedWith: granted ? personIds : [], shareConsent: granted ? 'granted' : 'not-granted' });
    },
    async setRememberNewThings(enabled) {
      await wait(latency);
      rememberNewThings = enabled;
    },
  };
}

function createConversation(latency: number): ConversationAdapter {
  return {
    async sendConversation(request) {
      await wait(latency * 3);
      return runDemoScript(request);
    },
  };
}

function createVoice(mode: MockVoiceMode, latency: number): VoiceAdapter {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const clear = () => timers.splice(0).forEach(clearTimeout);
  const step = Math.max(latency * 2, 1);
  return {
    isAvailable: () => mode !== 'unavailable',
    start(onEvent: (e: VoiceEvent) => void) {
      clear();
      if (mode !== 'ok') {
        timers.push(setTimeout(() => onEvent({ type: 'error', reason: mode }), step));
        return;
      }
      const script: VoiceEvent[] = [
        { type: 'listening' },
        { type: 'speech', partial: 'My tomato plants' },
        { type: 'speech', partial: 'My tomato plants look weak today' },
        { type: 'processing' },
        { type: 'final', transcript: 'My tomato plants look weak today.' },
      ];
      script.forEach((e, i) => timers.push(setTimeout(() => onEvent(e), step * (i + 1))));
    },
    stop: clear,
  };
}

export function createMockAdapters(options: MockOptions = {}): AssistantAdapters {
  const latency = options.latencyMs ?? 250;
  return {
    nari: createNari(latency),
    maitri: createMaitri(latency),
    conversation: createConversation(latency),
    voice: createVoice(options.voiceMode ?? 'ok', latency),
  };
}
