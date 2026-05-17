import { useState } from 'react';

/**
 * Props for the QuickAdd component.
 */
interface IQuickAddProps {
  onAdd: (description: string) => void;
}

/**
 * A bottom-docked input field for quickly adding task descriptions.
 */
export function QuickAdd({ onAdd }: IQuickAddProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onAdd(description.trim());
      setDescription('');
    }
  };

  return (
    <div className="quick-add-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="quick-add-input" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' }}>
          Omschrijving nieuwe taak
        </label>
        <input
          id="quick-add-input"
          type="text"
          placeholder="Wat moet je doen?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="quick-add-input"
        />
      </form>
    </div>
  );

}
