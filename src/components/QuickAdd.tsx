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
    <form className="quick-add-container quick-add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Wat moet je doen?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="quick-add-input"
        aria-label="Omschrijving nieuwe taak"
        style={{ paddingInlineEnd: description.trim() ? '3rem' : undefined }}
      />
      {description.trim() && (
        <button
          type="submit"
          className="icon-btn quick-add-submit-btn"
          aria-label="Taak toevoegen"
        >
          <span className="material-icons" aria-hidden="true" style={{ color: 'inherit' }}>add</span>
        </button>
      )}
    </form>
  );

}
