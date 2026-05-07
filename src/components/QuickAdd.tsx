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

  const handleSubmit = () => {
    if (description.trim()) {
      onAdd(description.trim());
      setDescription('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="quick-add-container">
      <input
        type="text"
        placeholder="Wat moet je doen?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        className="quick-add-input"
        aria-label="Omschrijving nieuwe taak"
      />
      <button
        type="button"
        className="icon-btn"
        onClick={handleSubmit}
        aria-label="Voeg taak toe"
      >
        <span className="material-icons" aria-hidden="true">add_circle</span>
      </button>
    </div>
  );

}
