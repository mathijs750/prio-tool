import { PRIORITY_ICON, SIZE_ICON } from '../types';
import type { ITask, Priority, Size, State } from '../types';

/**
 * Props for the TaskList component.
 */
interface ITaskListProps {
  tasks: ITask[];
  onComplete: (id: string) => void;
  onStartTimer: (id: string) => void;
  onStopTimer: (id: string) => void;
  now: number;
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
 * Weight mapping for sorting sizes.
 */
const SIZE_WEIGHT: Record<Size, number> = {
  'seed': 1,
  'plant': 2,
  'tree': 3,
};

/**
 * Weight mapping for sorting states.
 */
const STATE_WEIGHT: Record<State, number> = {
  'in-progress': 1,
  'todo': 2,
  'done': 3,
};

/**
 * A component that renders a list of tasks, sorted by state, priority and size.
 * 
 * @param props - The component props.
 * @returns The rendered task list.
 */
export function TaskList({ tasks, onComplete, onStartTimer, onStopTimer, now }: ITaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    // 1. Sort by state (done at the bottom)
    if (STATE_WEIGHT[a.state] !== STATE_WEIGHT[b.state]) {
      return STATE_WEIGHT[a.state] - STATE_WEIGHT[b.state];
    }
    // 2. If both are done, sort by finishedAt (most recent first)
    if (a.state === 'done' && b.state === 'done') {
      return (b.finishedAt || 0) - (a.finishedAt || 0);
    }
    // 3. Sort by priority (A -> B -> C)
    if (PRIORITY_WEIGHT[a.priority] !== PRIORITY_WEIGHT[b.priority]) {
      return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    }
    // 4. Sort by size (seed -> plant -> tree)
    return SIZE_WEIGHT[a.size] - SIZE_WEIGHT[b.size];
  });

  if (sortedTasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>Je heb geen taken (meer) te doen ✨</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <ul>
        {sortedTasks.map((task) => {
          let progress = 0;
          if (task.timerActive && task.timerStartTime && task.timerDuration && now > 0) {
            progress = Math.max(0, Math.min(100, ((now - task.timerStartTime) / task.timerDuration) * 100));
          }

          return (
            <li key={task.id} className={`task-card priority-${task.priority} state-${task.state}`}>
              {task.timerActive && (
                <div 
                  className="task-timer-progress" 
                  style={{ width: `${progress}%` }}
                />
              )}
              <div className="task-header">
                <span className="material-icons task-priority" title={`Priority ${task.priority}`}>
                  {PRIORITY_ICON[task.priority]}
                </span>
                <span className="task-description">{task.description}</span>
                <div className="task-meta">
                  <span className="material-icons task-size" title={`Size: ${task.size}`}>
                    {SIZE_ICON[task.size]}
                  </span>
                  <div className="task-actions">
                    {task.state !== 'done' && (
                      <>
                        {!task.timerActive ? (
                          <button 
                            className="icon-btn" 
                            onClick={() => onStartTimer(task.id)}
                            title="Start timer"
                            aria-label={`Start timer voor taak: ${task.description}`}
                          >
                            <span className="material-icons" aria-hidden="true">timer</span>
                          </button>
                        ) : (
                          <button 
                            className="icon-btn" 
                            onClick={() => onStopTimer(task.id)}
                            title="Pauzeer timer"
                            aria-label={`Pauzeer timer voor taak: ${task.description}`}
                          >
                            <span className="material-icons" aria-hidden="true">pause_circle</span>
                          </button>
                        )}
                        <button 
                          className="icon-btn" 
                          onClick={() => onComplete(task.id)}
                          title="Markeer als klaar"
                          aria-label={`Markeer taak als klaar: ${task.description}`}
                        >
                          <span className="material-icons" aria-hidden="true">check_circle</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {(task.subTasks && task.subTasks.length > 0 || task.timeSpent) && (
                <div className="task-subtasks">
                  {(task.timeSpent || task.state === 'done') && (
                    <div className="task-time-spent">
                      <span className="material-icons">schedule</span>
                      <span>
                        {task.state === 'done' && task.finishedAt && (
                          <>
                            {Math.max(0, Math.round((now - task.finishedAt) / (60 * 1000)))} minuten geleden afgerond
                            {task.timeSpent ? ' en ' : ''}
                          </>
                        )}
                        {task.timeSpent ? `${Math.round(task.timeSpent / (60 * 1000))} minuten besteed` : ''}
                      </span>
                    </div>
                  )}
                  {task.subTasks && task.subTasks.length > 0 && (
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
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
