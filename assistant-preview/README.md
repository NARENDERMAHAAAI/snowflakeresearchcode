# MahaaAi Assistant — Unified NARI + MAITRI preview

A single-page farmer conversation workspace: **one page, one conversation**. NARI (agriculture) and MAITRI (people and continuity) contribute behind one conversation adapter, so the farmer never picks an assistant or a mode.

> **Preview only.** All data is fictional demo data from `src/lib/assistant/mock`. There are no network calls, no real reminders or messages, no microphone use and no robot control of any kind.

## Run locally

```bash
cd assistant-preview
npm install
npm run dev        # http://127.0.0.1:5173/assistant
npm run typecheck
npm run lint
npm test
npm run build
```

Route: **`/assistant`**. Any other path is rewritten to it, because this app has only the one route.

QA switches, for the mock only:
- `/assistant?voice=denied` shows the microphone-permission-denied state.
- `/assistant?voice=unavailable` shows the no-microphone state.

## Structure

```
src/
  lib/assistant/
    types.ts              shared presentation types (no logic)
    adapters.ts           NariAdapter, MaitriAdapter, ConversationAdapter, VoiceAdapter
    AdaptersProvider.tsx  dependency injection for adapters
    mock/                 inert demo implementations (the only place demo data lives)
  i18n/                   centralized strings (English, Telugu) + provider
  hooks/                  conversation, voice state machine, context loading
  features/
    assistant/            shared shell: page, header, timeline, composer, context panel, RAKSHA notice
    nari/                 farm, crop health, sensors, alerts, robot status, insight blocks
    maitri/               tasks, farm team, memory summary, memory & consent panel, reminder blocks
```

The UI depends only on the interfaces in `adapters.ts`. To connect real services, pass another `AssistantAdapters` implementation to `<App adapters={...} />`. No component changes are needed.

## Safety and data rules built into the UI

- **Unknown data:** sensors show "Not connected" or "No recent reading" instead of values. Demo values are labelled "Demo data" or "Demo".
- **RAKSHA:** any physical request (robot, spraying, machinery) shows a safety boundary. `NariAdapter` has no command or actuation method, and the only button in the notice is disabled.
- **Reminders:** nothing is created until the farmer taps Confirm. In the preview, a confirmed reminder is stored in memory only.
- **Memory and consent:** sharing is off unless the farmer turns it on for a specific person. Sensitive items are masked by default. Every item can be removed, or removed and marked "don't remember".
- **No hidden reasoning:** replies render only user-safe text, evidence lists and notices.

## Language

UI strings live in `src/i18n/strings.ts`, and TypeScript makes sure every language has every key. The demo replies in Telugu when the farmer writes in Telugu script. The app language never switches on its own. The Telugu strings are a first pass and need review by a native speaker.

## Integration still required

- `ConversationAdapter.sendConversation` → the real MahaaAi conversation service (it replaces `mock/demo-script.ts`).
- `NariAdapter` → farm status, crop health, sensor feeds, alerts and robot status (read-only) from the Digital Twin and NARI services.
- `MaitriAdapter` → trusted people, tasks, reminders, and memory and consent storage.
- `VoiceAdapter` → speech capture and transcription (with a real microphone permission flow).
- Image upload → attachments are currently local object URLs. They need an upload step and an analysis result block.
- RAKSHA review → the disabled "Open safety review" button needs to link into the real, separately authorized robot-operations workflow.
