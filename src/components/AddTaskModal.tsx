import { useState } from 'react';
import { PRIORITY_EMOJI, SIZE_EMOJI } from '../types';
import type { Priority, Size, ITask } from '../types';

/**
 * Props for the AddTaskModal component.
 */
interface IAddTaskModalProps {
  isOpen: boolean;
  description: string;
  onClose: () => void;
  onSubmit: (task: Omit<ITask, 'id' | 'state'>) => void;
}

/**
 * Modal component for specifying task priority and size.
 */
export function AddTaskModal({ isOpen, description, onClose, onSubmit }: IAddTaskModalProps) {
  const [priority, setPriority] = useState<Priority>('B');
  const [size, setSize] = useState<Size>('plant');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ description, priority, size });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>New Task</h3>
        <p className="task-preview">"{description}"</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Priority</label>
            <div className="button-group">
              {(['A', 'B', 'C'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={priority === p ? 'active' : ''}
                  onClick={() => setPriority(p)}
                  title={`Priority ${p}`}
                >
                  {PRIORITY_EMOJI[p]} {p}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Size</label>
            <div className="button-group">
              {(['seed', 'plant', 'tree'] as Size[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={size === s ? 'active' : ''}
                  onClick={() => setSize(s)}
                  title={`Size ${s}`}
                >
                  {SIZE_EMOJI[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
