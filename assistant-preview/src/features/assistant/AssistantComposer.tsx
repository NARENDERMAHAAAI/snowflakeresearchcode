import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import type { OutgoingMessage } from '../../hooks/useConversation';
import { useVoice } from '../../hooks/useVoice';
import type { VoiceAdapter } from '../../lib/assistant/adapters';
import type { ImageAttachment } from '../../lib/assistant/types';
import { AttachmentControl } from './AttachmentControl';
import { CloseIcon, SendIcon } from './icons';
import { VoiceControl, VoiceStatus } from './VoiceControl';

interface Props {
  voice: VoiceAdapter;
  busy: boolean;
  online: boolean;
  lastWasVoice: boolean;
  onSend: (message: OutgoingMessage) => void;
}

let attachmentSeq = 0;

/** One composer for text, voice and photos. */
export function AssistantComposer({ voice, busy, online, lastWasVoice, onSend }: Props) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<ImageAttachment[]>([]);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const canSend = online && !busy && (text.trim().length > 0 || attachments.length > 0);

  const submit = useCallback(
    (inputMode: OutgoingMessage['inputMode'], value: string) => {
      onSend({ text: value.trim(), inputMode: attachments.length && !value.trim() ? 'image' : inputMode, attachments });
      setText('');
      setAttachments([]); // object URLs stay alive: the sent message still shows them
    },
    [attachments, onSend],
  );

  const onTranscript = useCallback(
    (transcript: string) => {
      if (online && !busy) submit('voice', transcript);
      else setText(transcript);
    },
    [busy, online, submit],
  );
  const { state: voiceState, partial, start, stop } = useVoice(voice, onTranscript);

  // Auto-grow the text box up to a few lines.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (canSend) submit('text', text);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (canSend) submit('text', text);
    }
  };

  const addFiles = (files: File[]) =>
    setAttachments((prev) => [
      ...prev,
      ...files.map((f) => ({ id: `img-${++attachmentSeq}`, name: f.name, previewUrl: URL.createObjectURL(f) })),
    ]);

  const removeAttachment = (id: string) =>
    setAttachments((prev) => {
      const gone = prev.find((a) => a.id === id);
      if (gone) URL.revokeObjectURL(gone.previewUrl);
      return prev.filter((a) => a.id !== id);
    });

  return (
    <form className="composer" onSubmit={handleSubmit} aria-label={t('composerLabel')}>
      {!online && (
        <p className="composer__offline" role="status">
          {t('offline')}
        </p>
      )}
      {attachments.length > 0 && (
        <ul className="composer__attachments">
          {attachments.map((a) => (
            <li key={a.id} className="thumb">
              <img src={a.previewUrl} alt={a.name} />
              <button
                type="button"
                className="thumb__remove"
                onClick={() => removeAttachment(a.id)}
                aria-label={t('removePhoto', { name: a.name })}
              >
                <CloseIcon width={14} height={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="composer__row">
        <AttachmentControl onSelect={addFiles} />
        <label htmlFor="composer-input" className="visually-hidden">
          {t('composerLabel')}
        </label>
        <textarea
          id="composer-input"
          ref={textRef}
          className="composer__input"
          rows={1}
          value={text}
          placeholder={t('composerPlaceholder')}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
        />
        <VoiceControl state={voiceState} onStart={start} onStop={stop} />
        <button type="submit" className="icon-btn icon-btn--send" disabled={!canSend} aria-label={t('send')}>
          <SendIcon />
        </button>
      </div>
      <VoiceStatus state={voiceState} partial={partial} responding={busy && lastWasVoice} />
    </form>
  );
}
