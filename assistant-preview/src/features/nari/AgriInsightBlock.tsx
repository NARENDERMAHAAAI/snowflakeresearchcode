import { useI18n } from '../../i18n/I18nProvider';
import { LeafIcon } from '../assistant/icons';

/** NARI insight inside a reply. Shows only user-safe summary + evidence. */
export function AgriInsightBlock({ title, body, evidence }: { title: string; body: string; evidence?: string[] }) {
  const { t } = useI18n();
  return (
    <section className="block block--insight" aria-label={t('farmInsight')}>
      <p className="block__eyebrow">
        <LeafIcon width={16} height={16} /> {t('farmInsight')}
      </p>
      <p className="block__title">{title}</p>
      <p>{body}</p>
      {evidence && evidence.length > 0 && (
        <>
          <p className="block__subhead">{t('basedOn')}</p>
          <ul className="plain-list">
            {evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
