import { useRef, useEffect, useState } from 'react';
import type { ITask } from '../types';

/**
 * Props for the TimeSpentPromptModal component.
 */
interface ITimeSpentPromptModalProps {
  task: ITask | null;
  onConfirm: (minutes: number) => void;
  onCancel: () => void;
}

/**
 * A modal that prompts the user for the total time spent when completing a task.
 */
export function TimeSpentPromptModal({ task, onConfirm, onCancel }: ITimeSpentPromptModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (task) {
      if (!dialog.open) {
        // Pre-fill with existing timeSpent (converted to minutes)
        const existingMinutes = Math.round((task.timeSpent || 0) / (60 * 1000));
        setMinutes(existingMinutes);
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
        <h2>Tijd besteed</h2>
        <p className="task-preview">Hoeveel tijd heb je in totaal besteed aan: <strong>{task.description}</strong>?</p>
        
        <div className="form-group">
          <label htmlFor="timeSpent">Minuten:</label>
          <input 
            id="timeSpent"
            type="number" 
            min="0" 
            max="1440" 
            value={minutes} 
            onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
            autoFocus
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>Annuleren</button>
          <button type="submit" className="primary">Opslaan & Voltooien</button>
        </div>
      </form>
    </dialog>
  );
}
