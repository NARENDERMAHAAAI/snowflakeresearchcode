/**
 * DEMO DATA — sanitized, fictional, preview-only.
 *
 * Nothing here comes from a real farm, sensor, robot, person or dataset.
 * Every record is tagged `source: 'demo'` so the UI labels it as such.
 * Unavailable sensors are represented as unavailable — no invented readings.
 */
import type {
  CropHealth,
  FarmAlert,
  FarmStatus,
  FarmTask,
  Locale,
  MemoryItem,
  RobotStatus,
  SensorReading,
  TrustedPerson,
} from '../types';

export type Localized = Record<Locale, string>;
export const pick = (text: Localized, locale: Locale): string => text[locale];

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export function demoFarm(locale: Locale): FarmStatus {
  return {
    source: 'demo',
    updatedAt: minutesAgo(12),
    farmName: pick({ en: 'Green Valley Farm', te: 'గ్రీన్ వ్యాలీ ఫార్మ్' }, locale),
    location: pick({ en: 'Demo site · Telangana', te: 'డెమో స్థలం · తెలంగాణ' }, locale),
    fieldName: pick({ en: 'Field 2 · East block', te: 'పొలం 2 · తూర్పు భాగం' }, locale),
    crop: pick({ en: 'Tomato', te: 'టమాటా' }, locale),
    growthStage: pick({ en: 'Flowering', te: 'పూత దశ' }, locale),
  };
}

export function demoCropHealth(locale: Locale): CropHealth {
  return {
    source: 'demo',
    updatedAt: minutesAgo(60 * 26),
    condition: 'watch',
    confidence: 'low',
    observations: [
      pick(
        { en: 'Some yellowing noted on lower leaves', te: 'కింది ఆకులపై కొంత పసుపు రంగు గమనించారు' },
        locale,
      ),
      pick(
        { en: 'No recent photo of affected plants', te: 'ప్రభావిత మొక్కల తాజా ఫోటో లేదు' },
        locale,
      ),
    ],
  };
}

export function demoSensors(locale: Locale): SensorReading[] {
  return [
    { id: 'soil-moisture', kind: 'soilMoisture', state: 'unavailable', source: 'demo' },
    { id: 'soil-temp', kind: 'soilTemperature', state: 'unknown', source: 'demo' },
    {
      id: 'weather',
      kind: 'weather',
      state: 'stale',
      source: 'demo',
      updatedAt: minutesAgo(180),
      displayValue: pick({ en: 'Partly cloudy', te: 'పాక్షికంగా మేఘావృతం' }, locale),
    },
    {
      id: 'irrigation',
      kind: 'irrigation',
      state: 'live',
      source: 'demo',
      updatedAt: minutesAgo(20),
      displayValue: pick(
        { en: 'Drip scheduled 6–7 AM', te: 'డ్రిప్ ఉదయం 6–7 షెడ్యూల్' },
        locale,
      ),
    },
  ];
}

export function demoAlerts(locale: Locale): FarmAlert[] {
  return [
    {
      id: 'a-safety',
      severity: 'safety',
      source: 'demo',
      updatedAt: minutesAgo(30),
      title: pick({ en: 'Spray zone closed', te: 'పిచికారీ ప్రాంతం మూసివేయబడింది' }, locale),
      detail: pick(
        {
          en: 'East block is closed to people until 4 PM after this morning’s spraying.',
          te: 'ఈ ఉదయం పిచికారీ తర్వాత తూర్పు భాగంలోకి సాయంత్రం 4 వరకు ఎవరూ వెళ్లకూడదు.',
        },
        locale,
      ),
    },
    {
      id: 'a-sensor',
      severity: 'warning',
      source: 'demo',
      updatedAt: minutesAgo(95),
      title: pick({ en: 'Soil moisture sensor not reporting', te: 'నేల తేమ సెన్సర్ స్పందించడం లేదు' }, locale),
      detail: pick(
        { en: 'No reading since yesterday evening.', te: 'నిన్న సాయంత్రం నుండి రీడింగ్ లేదు.' },
        locale,
      ),
    },
    {
      id: 'a-leaves',
      severity: 'attention',
      source: 'demo',
      updatedAt: minutesAgo(60 * 26),
      title: pick({ en: 'Leaf yellowing reported', te: 'ఆకులు పసుపు రంగులోకి మారుతున్నాయి' }, locale),
      detail: pick(
        { en: 'Worth a closer look in Field 2.', te: 'పొలం 2లో దగ్గరగా చూడటం మంచిది.' },
        locale,
      ),
    },
    {
      id: 'a-weather',
      severity: 'info',
      source: 'demo',
      updatedAt: minutesAgo(180),
      title: pick({ en: 'Weather update is 3 hours old', te: 'వాతావరణ సమాచారం 3 గంటల పాతది' }, locale),
      detail: pick(
        { en: 'Live weather is not connected in this preview.', te: 'ఈ ప్రివ్యూలో ప్రత్యక్ష వాతావరణం కనెక్ట్ కాలేదు.' },
        locale,
      ),
    },
  ];
}

export function demoRobots(locale: Locale): RobotStatus[] {
  return [
    {
      id: 'r1',
      name: 'Bhoomi-1',
      connection: 'online',
      power: 'charging',
      assignment: null,
      safety: 'safe-idle',
      source: 'demo',
      updatedAt: minutesAgo(3),
    },
    {
      id: 'r2',
      name: 'Bhoomi-2',
      connection: 'offline',
      power: 'unknown',
      assignment: pick({ en: 'Last task: field survey', te: 'చివరి పని: పొలం సర్వే' }, locale),
      safety: 'unknown',
      source: 'demo',
      updatedAt: minutesAgo(60 * 5),
    },
  ];
}

export function demoPeople(locale: Locale): TrustedPerson[] {
  return [
    {
      id: 'p-rajesh',
      displayName: pick({ en: 'Rajesh', te: 'రాజేష్' }, locale),
      relationship: pick({ en: 'Farm manager', te: 'వ్యవసాయ నిర్వాహకుడు' }, locale),
      initials: 'R',
    },
    {
      id: 'p-lakshmi',
      displayName: pick({ en: 'Lakshmi', te: 'లక్ష్మి' }, locale),
      relationship: pick({ en: 'Family', te: 'కుటుంబం' }, locale),
      initials: 'L',
    },
    {
      id: 'p-suresh',
      displayName: pick({ en: 'Suresh', te: 'సురేష్' }, locale),
      relationship: pick({ en: 'Visiting agronomist', te: 'వ్యవసాయ నిపుణుడు' }, locale),
      initials: 'S',
    },
  ];
}

/** Names the demo script recognises in farmer messages (both scripts). */
export const PERSON_ALIASES: Record<string, string[]> = {
  'p-rajesh': ['rajesh', 'రాజేష్'],
  'p-lakshmi': ['lakshmi', 'లక్ష్మి'],
  'p-suresh': ['suresh', 'సురేష్'],
};

export function demoTasks(locale: Locale): FarmTask[] {
  const t = (en: string, te: string) => pick({ en, te }, locale);
  return [
    { id: 't1', title: t('Inspect irrigation lines', 'నీటిపారుదల లైన్లను పరిశీలించండి'), due: 'today', origin: 'farm', assigneeId: 'p-rajesh', done: false, source: 'demo' },
    { id: 't2', title: t('Scout yellowing plants in Field 2', 'పొలం 2లో పసుపు మొక్కలను పరిశీలించండి'), due: 'today', origin: 'farm', done: false, source: 'demo' },
    { id: 't3', title: t('Check soil moisture by hand', 'నేల తేమను చేతితో తనిఖీ చేయండి'), due: 'today', origin: 'farm', done: false, source: 'demo' },
    { id: 't4', title: t('Review harvest plan', 'కోత ప్రణాళికను సమీక్షించండి'), due: 'today', origin: 'farm', done: true, source: 'demo' },
  ];
}

export function demoMemory(locale: Locale): MemoryItem[] {
  const t = (en: string, te: string) => pick({ en, te }, locale);
  return [
    {
      id: 'm-lang',
      category: 'personal',
      label: t('Preferred language', 'ఇష్టమైన భాష'),
      value: t('Telugu and English, mixed', 'తెలుగు మరియు ఇంగ్లీష్ కలిపి'),
      why: t('So replies sound the way you speak.', 'మీరు మాట్లాడే విధంగా సమాధానాలు ఉండటానికి.'),
      sensitive: false,
      sharedWith: [],
      shareConsent: 'not-granted',
    },
    {
      id: 'm-reminder-time',
      category: 'personal',
      label: t('Reminder time', 'రిమైండర్ సమయం'),
      value: t('Mornings, before 8 AM', 'ఉదయం 8 గంటలలోపు'),
      why: t('So reminders arrive when you are in the field.', 'మీరు పొలంలో ఉన్నప్పుడు రిమైండర్లు రావడానికి.'),
      sensitive: false,
      sharedWith: [],
      shareConsent: 'not-granted',
    },
    {
      id: 'm-crops',
      category: 'farm',
      label: t('Main crops', 'ప్రధాన పంటలు'),
      value: t('Tomato and chilli', 'టమాటా మరియు మిరప'),
      why: t('So advice fits the crops you actually grow.', 'మీరు పండించే పంటలకు సరిపోయే సలహా కోసం.'),
      sensitive: false,
      sharedWith: ['p-rajesh'],
      shareConsent: 'granted',
    },
    {
      id: 'm-irrigation',
      category: 'farm',
      label: t('Irrigation habit', 'నీటిపారుదల అలవాటు'),
      value: t('Drip irrigation early morning', 'తెల్లవారుజామున డ్రిప్ నీటిపారుదల'),
      why: t('So suggestions fit your routine.', 'సూచనలు మీ దినచర్యకు సరిపోవడానికి.'),
      sensitive: false,
      sharedWith: [],
      shareConsent: 'not-granted',
    },
    {
      id: 'm-rajesh',
      category: 'relational',
      label: t('Who checks irrigation', 'నీటిపారుదల ఎవరు చూస్తారు'),
      value: t('Rajesh usually handles irrigation checks', 'సాధారణంగా రాజేష్ నీటిపారుదల తనిఖీ చేస్తారు'),
      why: t('So reminders can go to the right person — only when you ask.', 'మీరు అడిగినప్పుడు మాత్రమే సరైన వ్యక్తికి రిమైండర్ వెళ్లడానికి.'),
      sensitive: false,
      sharedWith: [],
      shareConsent: 'not-granted',
    },
    {
      id: 'm-loan',
      category: 'personal',
      label: t('Money matter', 'ఆర్థిక విషయం'),
      value: t('Crop loan follow-up planned for March', 'మార్చిలో పంట రుణం గురించి చూడాలి'),
      why: t('You asked to be reminded about it.', 'దీని గురించి గుర్తు చేయమని మీరు అడిగారు.'),
      sensitive: true,
      sharedWith: [],
      shareConsent: 'not-granted',
    },
  ];
}
