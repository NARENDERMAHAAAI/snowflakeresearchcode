import type { ReactNode } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import type { AsyncState } from '../../hooks/useAsync';

interface ContextCardProps<T> {
  id: string;
  title: string;
  icon: ReactNode;
  state: AsyncState<T>;
  related?: boolean;
  demo?: boolean;
  children: (data: T) => ReactNode;
}

/** Shared card shell: heading, demo label, related marker, loading & error states. */
export function ContextCard<T>({ id, title, icon, state, related, demo = true, children }: ContextCardProps<T>) {
  const { t } = useI18n();
  const headingId = `${id}-title`;
  return (
    <section id={id} className={`ctx-card${related ? ' is-related' : ''}`} aria-labelledby={headingId} tabIndex={-1}>
      <header className="ctx-card__head">
        <span className="ctx-card__icon">{icon}</span>
        <h3 id={headingId}>{title}</h3>
        {demo && <span className="tag tag--demo">{t('demoData')}</span>}
      </header>
      {related && <p className="ctx-card__related">{t('relatedNow')}</p>}
      {state.data !== undefined ? (
        children(state.data)
      ) : state.status === 'error' ? (
        <p className="muted" role="status">{t('loadFailed')}</p>
      ) : (
        <p className="muted" aria-busy="true">{t('loading')}</p>
      )}
    </section>
  );
}
