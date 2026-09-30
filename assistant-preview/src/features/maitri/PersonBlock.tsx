import { useI18n } from '../../i18n/I18nProvider';
import type { TrustedPerson } from '../../lib/assistant/types';
import { PersonAvatar } from './TrustedPeopleCard';

export function PersonBlock({ person }: { person?: TrustedPerson }) {
  const { t } = useI18n();
  if (!person) return null;
  return (
    <p className="block block--person">
      <PersonAvatar person={person} />
      <span>
        <span className="person__name">{person.displayName}</span>
        <span className="muted small"> · {person.relationship} · {t('trustedPerson')}</span>
      </span>
    </p>
  );
}
