/**
 * Priority levels for tasks.
 */
export type Priority = 'A' | 'B' | 'C';

/**
 * Complexity sizes for tasks.
 */
export type Size = 'house' | 'wall' | 'brick';

/**
 * Execution states for tasks.
 */
export type State = 'todo' | 'in-progress' | 'done';

/**
 * Represents a task item.
 */
export interface ITask {
  id: string;
  description: string;
  size: Size;
  priority: Priority;
  state: State;
}
