import { useRef } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { CameraIcon } from './icons';

/** Opens the camera / photo picker. Files stay in the browser in the preview. */
export function AttachmentControl({ onSelect, disabled }: { onSelect: (files: File[]) => void; disabled?: boolean }) {
  const { t } = useI18n();
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        className="icon-btn"
        onClick={() => input.current?.click()}
        aria-label={t('attachPhoto')}
        disabled={disabled}
      >
        <CameraIcon />
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="environment"
        className="visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        data-testid="photo-input"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
          if (files.length) onSelect(files);
          e.target.value = '';
        }}
      />
    </>
  );
}
