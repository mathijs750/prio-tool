/**
 * Priority levels for tasks.
 */
export type Priority = 'A' | 'B' | 'C';

/**
 * Complexity sizes for tasks.
 */
export type Size = 'seed' | 'plant' | 'tree';

/**
 * Execution states for tasks.
 */
export type State = 'todo' | 'in-progress' | 'done';

/**
 * Represents a sub-task item.
 */
export interface ISubTask {
  description: string;
  priority: Priority;
  completed?: boolean;
}

/**
 * Represents a task item.
 */
export interface ITask {
  id: string;
  description: string;
  size: Size;
  priority: Priority;
  state: State;
  subTasks?: ISubTask[];
  timerDuration?: number; // Total duration in ms
  timerStartTime?: number; // timestamp when timer started
  timerActive?: boolean;
  timerUsed?: boolean;
  timeSpent?: number; // Total time spent in ms
  estimatedTime?: number; // Estimated time in ms
  finishedAt?: number; // timestamp when task was completed
}

/**
 * Priority to Material Icon mapping.
 */
export const PRIORITY_ICON: Record<Priority, string> = {
  'A': 'keyboard_double_arrow_up',
  'B': 'keyboard_arrow_up',
  'C': 'horizontal_rule',
};

/**
 * Size to Material Icon mapping.
 */
export const SIZE_ICON: Record<Size, string> = {
  'seed': 'eco',
  'plant': 'spa',
  'tree': 'forest',
};
