import { useCallback, useEffect, useRef, useState } from 'react';
import type { VoiceAdapter } from '../lib/assistant/adapters';

export type VoiceState = 'idle' | 'listening' | 'hearing' | 'processing' | 'unavailable' | 'denied';

/** UI state machine around a VoiceAdapter. Knows nothing about speech tech. */
export function useVoice(adapter: VoiceAdapter, onTranscript: (text: string) => void) {
  const [state, setState] = useState<VoiceState>(() => (adapter.isAvailable() ? 'idle' : 'unavailable'));
  const [partial, setPartial] = useState('');
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => () => adapter.stop(), [adapter]);

  const start = useCallback(() => {
    if (!adapter.isAvailable()) {
      setState('unavailable');
      return;
    }
    setPartial('');
    setState('listening');
    adapter.start((event) => {
      switch (event.type) {
        case 'listening':
          setState('listening');
          break;
        case 'speech':
          setState('hearing');
          setPartial(event.partial);
          break;
        case 'processing':
          setState('processing');
          break;
        case 'final':
          setState('idle');
          setPartial('');
          onTranscriptRef.current(event.transcript);
          break;
        case 'error':
          setState(event.reason);
          break;
      }
    });
  }, [adapter]);

  const stop = useCallback(() => {
    adapter.stop();
    setPartial('');
    setState((s) => (s === 'unavailable' || s === 'denied' ? s : 'idle'));
  }, [adapter]);

  return { state, partial, start, stop };
}
