import { useEffect, useId, useRef, type ReactNode } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { CloseIcon } from './icons';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** 'bottom' slides up on phones; 'center' is a regular modal. */
  variant?: 'bottom' | 'center';
  children: ReactNode;
}

/**
 * Modal built on the native <dialog>: focus containment, Escape to close and
 * focus restoration come from the platform instead of custom code.
 */
export function Sheet({ open, onClose, title, variant = 'center', children }: SheetProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`sheet sheet--${variant}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Tap on the backdrop closes the sheet.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet__inner">
        <header className="sheet__head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('close')}>
            <CloseIcon />
          </button>
        </header>
        <div className="sheet__body">{children}</div>
      </div>
    </dialog>
  );
}
