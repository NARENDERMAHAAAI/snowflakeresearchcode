/**
 * Adapter contracts between the UI and MahaaAi services.
 *
 * The React UI depends ONLY on these interfaces. The preview wires them to
 * the inert mocks in ./mock; real NARI / MAITRI / voice / image services can
 * be connected later by providing another implementation — no UI changes.
 *
 * Domain separation is preserved: NARI and MAITRI are distinct adapters.
 * Physical actions are deliberately absent: nothing here can move a robot.
 */
import type {
  ConversationReply,
  ConversationRequest,
  CropHealth,
  FarmAlert,
  FarmStatus,
  FarmTask,
  Locale,
  MaitriContext,
  MemorySummary,
  Reminder,
  RobotStatus,
  SensorReading,
  TrustedPerson,
} from './types';

export interface LocaleOptions {
  locale: Locale;
}

/** NARI — agriculture & physical-world context (read-only in the UI). */
export interface NariAdapter {
  getFarmStatus(opts: LocaleOptions): Promise<FarmStatus>;
  getCropHealth(opts: LocaleOptions): Promise<CropHealth>;
  getSensorReadings(opts: LocaleOptions): Promise<SensorReading[]>;
  getAlerts(opts: LocaleOptions): Promise<FarmAlert[]>;
  /** Status only. There is intentionally no command / actuation method. */
  getRobotStatus(opts: LocaleOptions): Promise<RobotStatus[]>;
}

/** MAITRI — people, continuity, reminders, memory & consent. */
export interface MaitriAdapter {
  getMaitriContext(): Promise<MaitriContext>;
  getTrustedPeople(opts: LocaleOptions): Promise<TrustedPerson[]>;
  getTodayTasks(opts: LocaleOptions): Promise<FarmTask[]>;
  getMemorySummary(opts: LocaleOptions): Promise<MemorySummary>;
  /** Confirms a reminder the farmer explicitly approved. */
  createReminder(reminder: Reminder): Promise<Reminder>;
  removeMemory(id: string): Promise<void>;
  /** Removes the item AND records the topic as "don't remember". */
  forgetAndBlock(id: string): Promise<void>;
  setShareConsent(id: string, personIds: string[], granted: boolean): Promise<void>;
  setRememberNewThings(enabled: boolean): Promise<void>;
}

/** The single conversation entry point. Routing to NARI / MAITRI happens behind it. */
export interface ConversationAdapter {
  sendConversation(request: ConversationRequest): Promise<ConversationReply>;
}

export type VoiceEvent =
  | { type: 'listening' }
  | { type: 'speech'; partial: string }
  | { type: 'processing' }
  | { type: 'final'; transcript: string }
  | { type: 'error'; reason: 'denied' | 'unavailable' };

/** Speech capture. The preview mock never touches the real microphone. */
export interface VoiceAdapter {
  isAvailable(): boolean;
  start(onEvent: (event: VoiceEvent) => void): void;
  stop(): void;
}

export interface AssistantAdapters {
  nari: NariAdapter;
  maitri: MaitriAdapter;
  conversation: ConversationAdapter;
  voice: VoiceAdapter;
}
