import { PRIORITY_EMOJI, SIZE_EMOJI } from '../types';
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
          <li key={task.id} className={`task-item priority-${task.priority} state-${task.state}`}>
            <div className="task-header">
              <span className="task-priority" title={`Priority ${task.priority}`}>
                {PRIORITY_EMOJI[task.priority]}
              </span>
              <span className="task-description">{task.description}</span>
              <span className="task-size" title={`Size: ${task.size}`}>
                {SIZE_EMOJI[task.size] || task.size}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
