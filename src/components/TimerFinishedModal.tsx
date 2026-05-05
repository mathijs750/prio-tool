import { useRef, useEffect } from 'react';
import type { ITask } from '../types';

/**
 * Props for the TimerFinishedModal component.
 */
interface ITimerFinishedModalProps {
  task: ITask | null;
  onResponse: (action: 'extend' | 'stop' | 'done') => void;
}

/**
 * A modal that appears when a task timer has finished.
 */
export function TimerFinishedModal({ task, onResponse }: ITimerFinishedModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (task) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [task]);

  if (!task) return null;

  return (
    <dialog 
      ref={dialogRef} 
      className="modal-content"
      onCancel={(e) => {
        e.preventDefault();
        onResponse('stop'); // Default to stop if cancelled
      }}
    >
      <h2>Timer Klaar!</h2>
      <p className="task-preview">Ben je klaar met: <strong>{task.description}</strong>?</p>
      <div className="modal-actions">
        <button type="button" onClick={() => onResponse('extend')}>+10 min</button>
        <button type="button" onClick={() => onResponse('stop')}>Stop werken</button>
        <button type="button" className="primary" onClick={() => onResponse('done')}>Taak is klaar</button>
      </div>
    </dialog>
  );
}
