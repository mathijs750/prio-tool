import { useRef, useEffect, useState } from 'react';
import type { ITask, ISubTask } from '../types';

/**
 * Props for the SubTaskCompletionModal component.
 */
interface ISubTaskCompletionModalProps {
  task: ITask | null;
  onConfirm: (subTasks: ISubTask[]) => void;
  onCancel: () => void;
}

/**
 * A modal that asks which subtasks were completed when a main task is finished.
 */
export function SubTaskCompletionModal({ task, onConfirm, onCancel }: ISubTaskCompletionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [localSubTasks, setLocalSubTasks] = useState<ISubTask[]>([]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (task) {
      if (!dialog.open) {
        // Default all to completed if the main task is being finished? 
        // Or keep current state? Let's default to current state but allow toggling.
        // Actually, user said "asking which task", implying we should check.
        setLocalSubTasks(task.subTasks?.map(st => ({ ...st })) || []);
        dialog.showModal();
      }
    } else {
      if (dialog.open) dialog.close();
    }
  }, [task]);

  const toggleSubTask = (index: number) => {
    setLocalSubTasks(prev => prev.map((st, i) => i === index ? { ...st, completed: !st.completed } : st));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(localSubTasks);
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
        <h2>Deeltaken afronden</h2>
        <p className="task-preview">Welke deeltaken zijn voltooid voor: <strong>{task.description}</strong>?</p>
        
        <div className="subtask-completion-list">
          {localSubTasks.map((st, index) => (
            <label key={index} className="subtask-check-item">
              <input 
                type="checkbox" 
                checked={!!st.completed} 
                onChange={() => toggleSubTask(index)}
              />
              <span className={st.completed ? 'completed' : ''}>{st.description}</span>
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>Annuleren</button>
          <button type="submit" className="primary">Bevestigen</button>
        </div>
      </form>
    </dialog>
  );
}
