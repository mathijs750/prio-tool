import { useRef, useEffect, useState } from 'react';
import type { ITask } from '../types';

/**
 * Props for the TimerEstimationModal component.
 */
interface ITimerEstimationModalProps {
  task: ITask | null;
  onConfirm: (minutes: number) => void;
  onCancel: () => void;
}

/**
 * A modal that prompts the user for a time estimate before starting a timer.
 */
export function TimerEstimationModal({ task, onConfirm, onCancel }: ITimerEstimationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (task) {
      if (!dialog.open) {
        const defaultMinutes = task.estimatedTime 
          ? Math.round(task.estimatedTime / (60 * 1000)) 
          : 30;
        setMinutes(defaultMinutes);
        dialog.showModal();
      }
    } else {
      if (dialog.open) dialog.close();
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(minutes);
  };

  if (!task) return null;

  return (
    <dialog 
      ref={dialogRef} 
      className="modal-content"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <form onSubmit={handleSubmit}>
        <h2>Inschatting</h2>
        <p className="task-preview">Hoe lang verwacht je bezig te zijn met: <strong>{task.description}</strong>?</p>
        
        <div className="form-group">
          <label htmlFor="estimation">Minuten:</label>
          <div className="estimation-input-group">
            <button 
              type="button" 
              className="adjust-btn" 
              onClick={() => setMinutes(m => Math.max(1, m - 5))}
              aria-label="Min 5 minuten"
            >
              -5
            </button>
            <input 
              id="estimation"
              type="number" 
              min="1" 
              max="480" 
              value={minutes} 
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              autoFocus
            />
            <button 
              type="button" 
              className="adjust-btn" 
              onClick={() => setMinutes(m => Math.min(480, m + 5))}
              aria-label="Plus 5 minuten"
            >
              +5
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>Annuleren</button>
          <button type="submit" className="primary">Start Timer</button>
        </div>
      </form>
    </dialog>
  );
}
