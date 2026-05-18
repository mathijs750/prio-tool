import { useState, useRef, useEffect } from 'react';
import { PRIORITY_ICON, SIZE_ICON } from '../types';
import type { Priority, Size, ITask, ISubTask } from '../types';

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
  const [subTasks, setSubTasks] = useState<ISubTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { description: '', priority: 'B' }]);
    setError(null);
  };

  const handleSubTaskDescChange = (index: number, value: string) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index].description = value;
    setSubTasks(newSubTasks);
    setError(null);
  };

  const handleSubTaskPriorityChange = (index: number, p: Priority) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index].priority = p;
    setSubTasks(newSubTasks);
  };

  const handleRemoveSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredSubTasks = subTasks.filter(st => st.description.trim() !== '');
    
    if (size === 'tree' && filteredSubTasks.length === 0) {
      setError('Tree tasks require at least one sub-task.');
      return;
    }

    onSubmit({ 
      description, 
      priority, 
      size, 
      subTasks: filteredSubTasks.length > 0 ? filteredSubTasks : undefined 
    });
    setSubTasks([]); // Reset
    onClose();
  };

  const showSubTasks = size === 'tree' || size === 'plant';

  return (
    <dialog 
      ref={dialogRef} 
      className="modal-content"
      onCancel={(e) => {
        e.preventDefault(); // Prevent default ESC behavior so React state stays in sync
        onClose();
      }}
    >
      <h2 >{description}</h2>
      
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Omvang</label>
          <div className="button-group">
            {(['seed', 'plant', 'tree'] as Size[]).map((s) => (
              <button
                key={s}
                type="button"
                className={size === s ? 'active' : ''}
                onClick={() => { setSize(s); setError(null); }}
                title={`Omvang ${s}`}
                aria-label={`Omvang ${s}`}
                aria-pressed={size === s}
              >
                <span className="material-icons" aria-hidden="true">{SIZE_ICON[s]}</span>
              </button>
            ))}
          </div>
        </div>

        {showSubTasks && (
          <div className="form-group">
            <label>Deeltaken {size === 'tree' ? '(Verplicht)' : '(Optioneel)'}</label>
            <div className="subtasks-scroll-container">
              {subTasks.map((st, index) => (
                <div key={index} className="subtask-row">
                  <div className="subtask-input-container">
                    <input
                      type="text"
                      className="subtask-input"
                      value={st.description}
                      onChange={(e) => handleSubTaskDescChange(index, e.target.value)}
                      placeholder={`Waar bestaat ${description} uit?`}
                      required={size === 'tree' && index === 0}
                    />
                    <button 
                      type="button" 
                      className="subtask-remove-btn"
                      onClick={() => handleRemoveSubTask(index)}
                      aria-label="Verwijder deeltaak"
                    >
                      <span className="material-icons" aria-hidden="true">close</span>
                    </button>
                  </div>
                  <div className="button-group subtask-priority-group">
                    {(['A', 'B', 'C'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={st.priority === p ? 'active' : ''}
                        onClick={() => handleSubTaskPriorityChange(index, p)}
                        title={`Urgentie ${p}`}
                        aria-label={`Urgentie ${p}`}
                        aria-pressed={st.priority === p}
                      >
                        <span className="material-icons" aria-hidden="true">{PRIORITY_ICON[p]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button 
              type="button" 
              className="add-subtask-btn"
              onClick={handleAddSubTask}
            >
              <span className="material-icons" style={{ fontSize: '1rem' }}>add</span> Voeg deeltaak toe
            </button>
          </div>
        )}

        <div className="form-group">
          <label>Urgentie</label>
          <div className="button-group">
            {(['A', 'B', 'C'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                className={priority === p ? 'active' : ''}
                onClick={() => setPriority(p)}
                title={`Urgentie ${p}`}
                aria-label={`Urgentie ${p}`}
                aria-pressed={priority === p}
              >
                <span className="material-icons" aria-hidden="true">{PRIORITY_ICON[p]}</span>
              </button>
            ))}
          </div>
        </div>


        {error && <div role="alert" className="error-message">{error}</div>}

        <div className="modal-actions">
          <button type="button" onClick={onClose}>Annuleren</button>
          <button type="submit" className="primary">Toevoegen</button>
        </div>
      
      </form>
    </dialog>
  );
}
