import { useI18n } from '../../i18n/I18nProvider';
import type { VoiceState } from '../../hooks/useVoice';
import { MicIcon, MicOffIcon, StopIcon } from './icons';

interface Props {
  state: VoiceState;
  onStart: () => void;
  onStop: () => void;
}

const ACTIVE: VoiceState[] = ['listening', 'hearing', 'processing'];

export function VoiceControl({ state, onStart, onStop }: Props) {
  const { t } = useI18n();
  const active = ACTIVE.includes(state);
  const blocked = state === 'unavailable' || state === 'denied';
  return (
    <button
      type="button"
      className={`icon-btn icon-btn--mic is-${state}`}
      onClick={active ? onStop : onStart}
      aria-pressed={active}
      aria-label={active ? t('micStop') : t('micStart')}
      disabled={state === 'unavailable'}
    >
      {active ? <StopIcon /> : blocked ? <MicOffIcon /> : <MicIcon />}
    </button>
  );
}

/** Status line under the composer for every voice state, in words (not colour alone). */
export function VoiceStatus({ state, partial, responding }: { state: VoiceState; partial: string; responding: boolean }) {
  const { t } = useI18n();
  let text = '';
  if (state === 'listening') text = t('voiceListening');
  else if (state === 'hearing') text = `${t('voiceHearing')}: “${partial}”`;
  else if (state === 'processing') text = t('voiceProcessing');
  else if (state === 'unavailable') text = t('voiceUnavailable');
  else if (state === 'denied') text = t('voiceDenied');
  else if (responding) text = t('voiceResponding');

  const active = state === 'listening' || state === 'hearing' || state === 'processing';
  return (
    <p className={`voice-status is-${state}`} role="status" aria-live="polite">
      {active && <span className="voice-status__wave" aria-hidden="true"><span /><span /><span /><span /></span>}
      <span>{text}</span>
      {active && <span className="muted small"> · {t('voiceDemoNote')}</span>}
    </p>
  );
}
