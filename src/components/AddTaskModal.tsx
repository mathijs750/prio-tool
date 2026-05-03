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
        <p className="task-preview"><em>"{description}"</em> is een:</p>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Formaat</label>
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


          <div className="form-group">
            <label>Urgentie</label>
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


          <div className="modal-actions">
            <button type="button" onClick={onClose}>Annuleer</button>
            <button type="submit" className="primary">Voeg taak toe</button>
          </div>
        
        </form>
      </div>
    </div>
  );
}
