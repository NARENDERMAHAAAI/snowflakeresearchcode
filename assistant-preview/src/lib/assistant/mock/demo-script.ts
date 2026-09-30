/**
 * DEMO SCRIPT — a keyword lookup that picks canned, clearly-labelled preview
 * replies for the five demo scenarios. It is NOT an intelligence model and
 * must be replaced by the real conversation service behind ConversationAdapter.
 * It never diagnoses, never invents sensor readings and never actuates.
 */
import type { ConversationReply, ConversationRequest, Domain, Locale, ResponseBlock, ContextSection } from '../types';
import { PERSON_ALIASES, demoSensors, pick, type Localized } from './mock-data';

const TELUGU_SCRIPT = /[ఀ-౿]/;

const PATTERNS = {
  physical: /\b(robot|spray|spraying|drone|tractor|harvester|cut|cutting)\b|రోబో|పిచికారీ|స్ప్రే/i,
  moisture: /moisture|తేమ/i,
  crop: /\b(tomato|tomatoes|weak|leaf|leaves|yellow|wilt|plants?|crop)\b|టమాట|బలహీన|ఆకు|మొక్క|పంట/i,
  reminder: /\bremind|reminder\b|గుర్తు|రిమైండ/i,
  irrigation: /irrigation|నీటిపారుదల|ఇరిగేషన్/i,
  tomorrow: /tomorrow|రేపు/i,
};

let reminderSeq = 0;

function replyLocale(req: ConversationRequest): Locale {
  // Reply in the script the farmer used for this message; otherwise keep their
  // preferred UI language. The app language never flips on its own.
  return TELUGU_SCRIPT.test(req.text) ? 'te' : req.locale;
}

function findPerson(text: string): string | undefined {
  const lower = text.toLowerCase();
  return Object.entries(PERSON_ALIASES).find(([, names]) => names.some((n) => lower.includes(n)))?.[0];
}

function reminderTask(text: string, locale: Locale): string {
  if (locale === 'en') {
    const m = /\bto ((?:check|inspect|look at|review|clean|fix)[^.,!?]*)/i.exec(text);
    if (m?.[1]) {
      const task = m[1].trim();
      return task.charAt(0).toUpperCase() + task.slice(1);
    }
  }
  if (PATTERNS.irrigation.test(text)) {
    return pick({ en: 'Check irrigation', te: 'నీటిపారుదల తనిఖీ' }, locale);
  }
  return pick({ en: 'Follow up on the farm', te: 'పొలం పనిని చూడండి' }, locale);
}

const CROP = {
  intro: {
    en: 'I’m sorry the tomatoes look weak today. Let’s look at it together.',
    te: 'ఈ రోజు టమాటా మొక్కలు బలహీనంగా ఉన్నాయని విన్నాను. కలిసి చూద్దాం.',
  },
  title: { en: 'Tomato plants · Field 2', te: 'టమాటా మొక్కలు · పొలం 2' },
  body: {
    en: 'NARI crop analysis would appear here once field data is connected. Nothing has been diagnosed yet.',
    te: 'పొలం డేటా కనెక్ట్ అయిన తర్వాత NARI పంట విశ్లేషణ ఇక్కడ కనిపిస్తుంది. ఇంకా ఏ నిర్ధారణా చేయలేదు.',
  },
  ev1: { en: 'Last scouting note (demo): some yellowing on lower leaves', te: 'చివరి పరిశీలన (డెమో): కింది ఆకులపై కొంత పసుపు రంగు' },
  ev2: { en: 'Soil moisture: not connected', te: 'నేల తేమ: కనెక్ట్ కాలేదు' },
  ev3: { en: 'No recent photo of these plants', te: 'ఈ మొక్కల తాజా ఫోటో లేదు' },
  photo: {
    en: 'A clear photo of an affected leaf would help. Tap the camera button to add one.',
    te: 'ప్రభావిత ఆకు స్పష్టమైన ఫోటో సహాయపడుతుంది. ఫోటో జోడించడానికి కెమెరా బటన్ నొక్కండి.',
  },
} satisfies Record<string, Localized>;

const TEXT = {
  reminderIntro: {
    en: 'I can set that up. Please check the details — nothing is sent until you confirm.',
    te: 'నేను ఏర్పాటు చేయగలను. వివరాలు చూడండి — మీరు నిర్ధారించే వరకు ఏదీ పంపబడదు.',
  },
  combinedIntro: {
    en: 'Here’s both together — your tomato field, and the reminder for Rajesh.',
    te: 'మీ టమాటా పొలం మరియు రిమైండర్ — రెండూ ఇక్కడ ఉన్నాయి.',
  },
  whenTomorrow: { en: 'Tomorrow, 7:00 AM', te: 'రేపు, ఉదయం 7:00' },
  whenToday: { en: 'Today, 5:00 PM', te: 'ఈ రోజు, సాయంత్రం 5:00' },
  noPerson: {
    en: 'Who should I remind? You can pick someone from your farm team.',
    te: 'ఎవరికి గుర్తు చేయాలి? మీ వ్యవసాయ బృందం నుండి ఎంచుకోవచ్చు.',
  },
  moisture: {
    en: 'Soil moisture is currently unavailable. The field sensor is not connected, so I won’t guess a number.',
    te: 'నేల తేమ ప్రస్తుతం అందుబాటులో లేదు. పొలం సెన్సర్ కనెక్ట్ కాలేదు, కాబట్టి నేను సంఖ్యను ఊహించను.',
  },
  moistureTip: {
    en: 'You could check by hand today — “Check soil moisture by hand” is in Today’s Tasks.',
    te: 'ఈ రోజు చేతితో చూడవచ్చు — “నేల తేమను చేతితో తనిఖీ చేయండి” ఈ రోజు పనులలో ఉంది.',
  },
  physicalIntro: {
    en: 'I can’t send the robot from this conversation.',
    te: 'ఈ సంభాషణ నుండి రోబోను పంపలేను.',
  },
  physicalAction: { en: 'Robot spraying', te: 'రోబో పిచికారీ' },
  physicalReason: {
    en: 'Spraying uses machinery and chemicals. It needs a RAKSHA safety review and approval in the robot operations workflow — not from chat.',
    te: 'పిచికారీకి యంత్రాలు, రసాయనాలు అవసరం. దీనికి RAKSHA భద్రతా సమీక్ష మరియు రోబో కార్యకలాపాల విధానంలో అనుమతి అవసరం — చాట్ నుండి కాదు.',
  },
  physicalTip: {
    en: 'I can help you note which area needs attention so it’s ready for that review.',
    te: 'ఏ ప్రాంతానికి శ్రద్ధ అవసరమో నమోదు చేయడంలో సహాయం చేయగలను, సమీక్షకు సిద్ధంగా ఉంటుంది.',
  },
  image: {
    en: 'Leaf image received. NARI analysis would appear here once the image service is connected.',
    te: 'ఆకు చిత్రం అందింది. చిత్ర సేవ కనెక్ట్ అయిన తర్వాత NARI విశ్లేషణ ఇక్కడ కనిపిస్తుంది.',
  },
  fallback: {
    en: 'I’m here. You can ask about your crops, your field, reminders, or your farm team.',
    te: 'నేను ఇక్కడ ఉన్నాను. మీ పంటలు, పొలం, రిమైండర్లు లేదా వ్యవసాయ బృందం గురించి అడగవచ్చు.',
  },
} satisfies Record<string, Localized>;

export function runDemoScript(req: ConversationRequest): ConversationReply {
  const locale = replyLocale(req);
  const L = (s: Localized) => pick(s, locale);
  const text = req.text;
  const blocks: ResponseBlock[] = [];
  const domains = new Set<Domain>();
  const related = new Set<ContextSection>();

  // Physical actions take precedence: the safety boundary is always shown.
  if (PATTERNS.physical.test(text)) {
    blocks.push(
      { kind: 'text', text: L(TEXT.physicalIntro) },
      { kind: 'safety', action: L(TEXT.physicalAction), reason: L(TEXT.physicalReason) },
      { kind: 'notice', tone: 'info', text: L(TEXT.physicalTip) },
    );
    return { blocks, domains: ['nari'], related: ['robot', 'alerts'], source: 'demo' };
  }

  if (req.attachments.length > 0) {
    domains.add('nari');
    related.add('crop');
    blocks.push({ kind: 'text', text: L(TEXT.image) });
    for (const a of req.attachments) blocks.push({ kind: 'image-received', attachmentName: a.name });
  }

  const wantsCrop = PATTERNS.crop.test(text) && !PATTERNS.moisture.test(text);
  const wantsReminder = PATTERNS.reminder.test(text);

  if (wantsCrop && wantsReminder) blocks.push({ kind: 'text', text: L(TEXT.combinedIntro) });

  if (PATTERNS.moisture.test(text)) {
    domains.add('nari');
    related.add('sensors');
    const reading = demoSensors(locale).find((s) => s.kind === 'soilMoisture')!;
    blocks.push(
      { kind: 'text', text: L(TEXT.moisture) },
      { kind: 'sensor', reading },
      { kind: 'notice', tone: 'info', text: L(TEXT.moistureTip) },
    );
  }

  if (wantsCrop && req.attachments.length === 0) {
    domains.add('nari');
    related.add('crop');
    if (!wantsReminder) blocks.push({ kind: 'text', text: L(CROP.intro) });
    blocks.push(
      { kind: 'agri-insight', title: L(CROP.title), body: L(CROP.body), evidence: [L(CROP.ev1), L(CROP.ev2), L(CROP.ev3)] },
      { kind: 'notice', tone: 'info', text: L(CROP.photo) },
    );
  }

  if (wantsReminder) {
    domains.add('maitri');
    related.add('tasks');
    related.add('people');
    const personId = findPerson(text);
    if (!personId) {
      blocks.push({ kind: 'text', text: L(TEXT.noPerson) });
    } else {
      if (!wantsCrop) blocks.push({ kind: 'text', text: L(TEXT.reminderIntro) });
      blocks.push(
        { kind: 'person', personId },
        {
          kind: 'reminder',
          reminder: {
            id: `rem-${Date.now()}-${++reminderSeq}`,
            personId,
            task: reminderTask(text, locale),
            whenLabel: L(PATTERNS.tomorrow.test(text) ? TEXT.whenTomorrow : TEXT.whenToday),
            status: 'proposed',
          },
        },
      );
    }
  }

  if (blocks.length === 0) {
    blocks.push({ kind: 'text', text: L(TEXT.fallback) });
  }

  return { blocks, domains: [...domains], related: [...related], source: 'demo' };
}
