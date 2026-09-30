import { useCallback, useRef, useState } from 'react';
import { useAdapters } from '../lib/assistant/AdaptersProvider';
import type { ConversationMessage, ImageAttachment, InputMode, Locale, ResponseBlock } from '../lib/assistant/types';

export interface OutgoingMessage {
  text: string;
  inputMode: InputMode;
  attachments: ImageAttachment[];
}

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++seq}`;

type ReminderBlock = Extract<ResponseBlock, { kind: 'reminder' }>;

function patchReminder(
  messages: ConversationMessage[],
  messageId: string,
  reminderId: string,
  patch: (b: ReminderBlock) => ReminderBlock,
): ConversationMessage[] {
  return messages.map((m) =>
    m.id !== messageId
      ? m
      : { ...m, blocks: m.blocks?.map((b) => (b.kind === 'reminder' && b.reminder.id === reminderId ? patch(b) : b)) },
  );
}

/**
 * One conversation for the farmer. The single ConversationAdapter decides
 * which domains contribute; this hook only manages message state.
 */
export function useConversation(locale: Locale, onContextChanged: () => void) {
  const { conversation, maitri } = useAdapters();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const inFlight = useRef(false);

  const request = useCallback(
    async (assistantId: string, out: OutgoingMessage) => {
      inFlight.current = true;
      try {
        const reply = await conversation.sendConversation({ ...out, locale });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, status: 'sent', blocks: reply.blocks, domains: reply.domains, related: reply.related, source: reply.source }
              : m,
          ),
        );
      } catch {
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, status: 'error' } : m)));
      } finally {
        inFlight.current = false;
      }
    },
    [conversation, locale],
  );

  const send = useCallback(
    (out: OutgoingMessage) => {
      if (inFlight.current) return;
      const now = new Date().toISOString();
      const farmer: ConversationMessage = {
        id: nextId('f'),
        role: 'farmer',
        createdAt: now,
        status: 'sent',
        inputMode: out.inputMode,
        text: out.text,
        attachments: out.attachments,
      };
      const assistantId = nextId('a');
      const pending: ConversationMessage = { id: assistantId, role: 'assistant', createdAt: now, status: 'pending' };
      setMessages((prev) => [...prev, farmer, pending]);
      void request(assistantId, out);
    },
    [request],
  );

  const retry = useCallback(
    (assistantId: string) => {
      if (inFlight.current) return;
      const idx = messages.findIndex((m) => m.id === assistantId);
      const farmer = messages[idx - 1];
      if (idx < 1 || !farmer || farmer.role !== 'farmer') return;
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, status: 'pending' } : m)));
      void request(assistantId, {
        text: farmer.text ?? '',
        inputMode: farmer.inputMode ?? 'text',
        attachments: farmer.attachments ?? [],
      });
    },
    [messages, request],
  );

  /** Only runs after the farmer explicitly taps Confirm. Mock: nothing is sent. */
  const confirmReminder = useCallback(
    async (messageId: string, reminderId: string) => {
      const block = messages
        .find((m) => m.id === messageId)
        ?.blocks?.find((b): b is ReminderBlock => b.kind === 'reminder' && b.reminder.id === reminderId);
      if (!block || block.reminder.status !== 'proposed') return;
      const saved = await maitri.createReminder(block.reminder);
      setMessages((prev) => patchReminder(prev, messageId, reminderId, (b) => ({ ...b, reminder: saved })));
      onContextChanged();
    },
    [maitri, messages, onContextChanged],
  );

  const cancelReminder = useCallback((messageId: string, reminderId: string) => {
    setMessages((prev) =>
      patchReminder(prev, messageId, reminderId, (b) => ({ ...b, reminder: { ...b.reminder, status: 'cancelled' } })),
    );
  }, []);

  const pending = messages.some((m) => m.status === 'pending');

  return { messages, pending, send, retry, confirmReminder, cancelReminder };
}
