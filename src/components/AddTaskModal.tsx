import { useState } from 'react';
import { PRIORITY_EMOJI, SIZE_EMOJI } from '../types';
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

  if (!isOpen) return null;

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { description: '', priority: 'B' }]);
  };

  const handleSubTaskDescChange = (index: number, value: string) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index].description = value;
    setSubTasks(newSubTasks);
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
      alert('Tree tasks require at least one sub-task.');
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

          {showSubTasks && (
            <div className="form-group">
              <label>Subtasks {size === 'tree' ? '(Vereist)' : '(Optioneel)'}</label>
              <div className="subtasks-scroll-container">
                {subTasks.map((st, index) => (
                  <div key={index} className="subtask-input-row" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', padding: '8px', background: 'var(--social-bg)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={st.description}
                        onChange={(e) => handleSubTaskDescChange(index, e.target.value)}
                        placeholder={`Subtask ${index + 1}`}
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                        required={size === 'tree' && index === 0}
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSubTask(index)} 
                        style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        ×
                      </button>
                    </div>
                    <div className="button-group subtask-priority-group">
                      {(['A', 'B', 'C'] as Priority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={st.priority === p ? 'active' : ''}
                          onClick={() => handleSubTaskPriorityChange(index, p)}
                        >
                          {PRIORITY_EMOJI[p]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={handleAddSubTask} 
                style={{ width: '100%', padding: '8px', background: 'var(--bg)', border: '1px dashed var(--border)', borderRadius: '4px', cursor: 'pointer' }}
              >
                + Voeg subtask toe
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
