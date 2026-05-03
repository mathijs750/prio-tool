import type { ITask } from './types';

/**
 * Props for the TaskList component.
 */
interface ITaskListProps {
  tasks: ITask[];
}

/**
 * A component that renders a list of tasks.
 * 
 * @param props - The component props.
 * @returns The rendered task list.
 */
export function TaskList({ tasks }: ITaskListProps) {
  return (
    <div className="task-list">
      <h2>Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={`task-item priority-${task.priority}`}>
            <div className="task-header">
              <span className="task-priority">[{task.priority}]</span>
              <span className="task-description">{task.description}</span>
            </div>
            <div className="task-details">
              <span className="task-size">Size: {task.size}</span>
              <span className={`task-state state-${task.state}`}>
                Status: {task.state}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
