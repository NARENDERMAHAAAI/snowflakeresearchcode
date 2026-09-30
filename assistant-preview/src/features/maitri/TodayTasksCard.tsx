import { useI18n } from '../../i18n/I18nProvider';
import type { AsyncState } from '../../hooks/useAsync';
import type { FarmTask, TrustedPerson } from '../../lib/assistant/types';
import { ContextCard } from '../assistant/ContextCard';
import { CheckIcon, TaskIcon } from '../assistant/icons';

interface Props {
  state: AsyncState<FarmTask[]>;
  people: TrustedPerson[];
  related?: boolean;
}

export function TodayTasksCard({ state, people, related }: Props) {
  const { t } = useI18n();
  const nameOf = (id?: string) => people.find((p) => p.id === id)?.displayName;
  return (
    <ContextCard id="ctx-tasks" title={t('todaysTasks')} icon={<TaskIcon />} state={state} related={related}>
      {(tasks) => (
        <ul className="task-list">
          {tasks.map((task) => {
            const who = nameOf(task.assigneeId);
            return (
              <li key={task.id} className={`task${task.done ? ' is-done' : ''}`}>
                <span className="task__mark" aria-hidden="true">{task.done && <CheckIcon width={14} height={14} />}</span>
                <div>
                  <p className="task__title">{task.title}</p>
                  <p className="muted small">
                    {[
                      task.done && t('taskDone'),
                      task.origin === 'reminder' && t('taskFromReminder'),
                      task.due === 'tomorrow' && (task.dueLabel ?? t('due_tomorrow')),
                      who,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ContextCard>
  );
}
