import { PRIORITY_ICON, SIZE_ICON } from '../types';
import type { ITask, Priority } from '../types';

/**
 * Props for the TaskList component.
 */
interface ITaskListProps {
  tasks: ITask[];
}

/**
 * Weight mapping for sorting priorities.
 */
const PRIORITY_WEIGHT: Record<Priority, number> = {
  'A': 1,
  'B': 2,
  'C': 3,
};

/**
 * A component that renders a list of tasks, sorted by priority.
 * 
 * @param props - The component props.
 * @returns The rendered task list.
 */
export function TaskList({ tasks }: ITaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => 
    PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
  );

  return (
    <div className="task-list">
      <ul>
        {sortedTasks.map((task) => (
          <li key={task.id} className={`task-card priority-${task.priority} state-${task.state}`}>
            <div className="task-header">
              <span className="material-icons task-priority" title={`Priority ${task.priority}`}>
                {PRIORITY_ICON[task.priority]}
              </span>
              <span className="task-description">{task.description}</span>
              <span className="material-icons task-size" title={`Size: ${task.size}`}>
                {SIZE_ICON[task.size]}
              </span>
            </div>
            {task.subTasks && task.subTasks.length > 0 && (
              <div className="task-subtasks">
                <ul>
                  {[...task.subTasks]
                    .sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority])
                    .map((st, i) => (
                      <li key={i} className="subtask-item">
                        <span className="material-icons subtask-priority">{PRIORITY_ICON[st.priority]}</span>
                        <span className="subtask-description">{st.description}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
