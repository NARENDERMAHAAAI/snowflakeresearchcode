/**
 * Shared, presentation-level types for the unified MahaaAi Assistant.
 *
 * These describe what the UI can *display*. They intentionally carry no
 * reasoning, ranking or decision logic — real NARI / MAITRI services will
 * populate them behind the adapter interfaces in ./adapters.ts.
 */

export type Locale = 'en' | 'te';

/** Intelligence domains the farmer never has to pick between. */
export type Domain = 'nari' | 'maitri';

/** How fresh / trustworthy a piece of displayed data is. */
export type DataState = 'live' | 'stale' | 'unavailable' | 'unknown';

/** Every mock value is tagged so the UI can label it honestly. */
export interface Provenance {
  source: 'demo' | 'live';
  /** ISO timestamp of the last reading / sync, if any. */
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* NARI — agriculture & physical-world context                         */
/* ------------------------------------------------------------------ */

export interface FarmStatus extends Provenance {
  farmName: string;
  location: string;
  fieldName: string;
  crop: string;
  growthStage: string;
}

export type HealthCondition = 'good' | 'watch' | 'concern' | 'unknown';

export interface CropHealth extends Provenance {
  condition: HealthCondition;
  observations: string[];
  /** Coarse, user-safe confidence wording — never a fake-precise score. */
  confidence: 'high' | 'medium' | 'low' | 'unknown';
}

export type SensorKind = 'soilMoisture' | 'soilTemperature' | 'weather' | 'irrigation';

export interface SensorReading extends Provenance {
  id: string;
  kind: SensorKind;
  state: DataState;
  /** Display-ready value. Absent whenever state is not 'live' / 'stale'. */
  displayValue?: string;
}

export type AlertSeverity = 'info' | 'attention' | 'warning' | 'safety';

export interface FarmAlert extends Provenance {
  id: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
}

export type RobotConnection = 'online' | 'offline';
export type RobotPower = 'charging' | 'available' | 'busy' | 'unknown';
export type SafetyState = 'safe-idle' | 'review-required' | 'stopped' | 'unknown';

export interface RobotStatus extends Provenance {
  id: string;
  name: string;
  connection: RobotConnection;
  power: RobotPower;
  assignment: string | null;
  safety: SafetyState;
}

/* ------------------------------------------------------------------ */
/* MAITRI — human relationship & continuity context                    */
/* ------------------------------------------------------------------ */

export interface TrustedPerson {
  id: string;
  displayName: string;
  /** e.g. "Farm manager", "Son" — no phone numbers or addresses in the UI. */
  relationship: string;
  initials: string;
}

export type TaskOrigin = 'farm' | 'reminder';

export interface FarmTask {
  id: string;
  title: string;
  due: 'today' | 'tomorrow';
  dueLabel?: string;
  origin: TaskOrigin;
  assigneeId?: string;
  done: boolean;
  source: Provenance['source'];
}

export type MemoryCategory = 'personal' | 'farm' | 'relational';
export type ConsentState = 'granted' | 'not-granted';

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  label: string;
  value: string;
  /** Why remembering this may help — shown to the farmer. */
  why: string;
  /** Sensitive items are masked until the farmer chooses to reveal them. */
  sensitive: boolean;
  /** People this item may be shared with — only when consent is granted. */
  sharedWith: string[];
  shareConsent: ConsentState;
}

export interface MaitriContext {
  preferredLanguage: Locale;
  /** Whether MAITRI may remember new things from conversations. */
  rememberNewThings: boolean;
  rememberConsentRecordedAt?: string;
}

export interface MemorySummary {
  settings: MaitriContext;
  items: MemoryItem[];
  /** Topics the farmer asked MAITRI not to remember. */
  doNotRemember: string[];
}

export interface Reminder {
  id: string;
  personId: string;
  task: string;
  whenLabel: string;
  status: 'proposed' | 'confirmed' | 'cancelled';
}

/* ------------------------------------------------------------------ */
/* Conversation                                                        */
/* ------------------------------------------------------------------ */

export type InputMode = 'text' | 'voice' | 'image';

export interface ImageAttachment {
  id: string;
  name: string;
  /** Object URL for local preview only — never uploaded in the preview. */
  previewUrl: string;
}

/** Context-panel sections a response can point the farmer towards. */
export type ContextSection =
  | 'farm'
  | 'crop'
  | 'sensors'
  | 'alerts'
  | 'robot'
  | 'tasks'
  | 'people'
  | 'memory';

/**
 * Structured pieces of an assistant reply. The UI renders each one; it never
 * receives or displays hidden reasoning — only user-safe summaries/evidence.
 */
export type ResponseBlock =
  | { kind: 'text'; text: string }
  | { kind: 'agri-insight'; title: string; body: string; evidence?: string[] }
  | { kind: 'sensor'; reading: SensorReading }
  | { kind: 'reminder'; reminder: Reminder }
  | { kind: 'safety'; action: string; reason: string }
  | { kind: 'image-received'; attachmentName: string }
  | { kind: 'notice'; tone: 'info' | 'warning'; text: string }
  | { kind: 'person'; personId: string };

export interface ConversationMessage {
  id: string;
  role: 'farmer' | 'assistant';
  createdAt: string;
  status: 'pending' | 'sent' | 'error';
  inputMode?: InputMode;
  text?: string;
  attachments?: ImageAttachment[];
  blocks?: ResponseBlock[];
  /** Domains that contributed — shown subtly, never as a mode switch. */
  domains?: Domain[];
  related?: ContextSection[];
  source?: Provenance['source'];
}

export interface ConversationRequest {
  text: string;
  inputMode: InputMode;
  attachments: ImageAttachment[];
  locale: Locale;
}

export interface ConversationReply {
  blocks: ResponseBlock[];
  domains: Domain[];
  related: ContextSection[];
  source: Provenance['source'];
}
