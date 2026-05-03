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
 * Represents a task item.
 */
export interface ITask {
  id: string;
  description: string;
  size: Size;
  priority: Priority;
  state: State;
}

/**
 * Priority to emoji mapping.
 */
export const PRIORITY_EMOJI: Record<Priority, string> = {
  'A': '⬆️',
  'B': '➖',
  'C': '⬇️',
};

/**
 * Size to emoji mapping.
 */
export const SIZE_EMOJI: Record<Size, string> = {
  'seed': '🌱',
  'plant': '🌿',
  'tree': '🌳',
};

