import { useRef, useEffect } from 'react';
import type { ITask } from '../types';

/**
 * Props for the TimerFinishedModal component.
 */
interface ITimerFinishedModalProps {
  task: ITask | null;
  onResponse: (done: boolean) => void;
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
        onResponse(false); // Default to starting another timer or just closing
      }}
    >
      <h2>Timer Klaar!</h2>
      <p className="task-preview">Ben je klaar met: <strong>{task.description}</strong>?</p>
      <div className="modal-actions">
        <button type="button" onClick={() => onResponse(false)}>Nog een timer</button>
        <button type="button" className="primary" onClick={() => onResponse(true)}>Ja, klaar!</button>
      </div>
    </dialog>
  );
}
