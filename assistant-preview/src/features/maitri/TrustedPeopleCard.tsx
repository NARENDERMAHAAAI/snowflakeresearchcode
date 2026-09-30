import { useI18n } from '../../i18n/I18nProvider';
import type { AsyncState } from '../../hooks/useAsync';
import type { TrustedPerson } from '../../lib/assistant/types';
import { ContextCard } from '../assistant/ContextCard';
import { PeopleIcon } from '../assistant/icons';

export function PersonAvatar({ person }: { person: TrustedPerson }) {
  return (
    <span className="avatar" aria-hidden="true">
      {person.initials}
    </span>
  );
}

export function TrustedPeopleCard({ state, related }: { state: AsyncState<TrustedPerson[]>; related?: boolean }) {
  const { t } = useI18n();
  return (
    <ContextCard id="ctx-people" title={t('farmTeam')} icon={<PeopleIcon />} state={state} related={related}>
      {(people) => (
        <>
          <ul className="people-list">
            {people.map((p) => (
              <li key={p.id} className="person">
                <PersonAvatar person={p} />
                <span>
                  <span className="person__name">{p.displayName}</span>
                  <span className="muted small person__role">{p.relationship}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="muted small">{t('farmTeamNote')}</p>
        </>
      )}
    </ContextCard>
  );
}
