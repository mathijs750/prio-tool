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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && description.trim()) {
      onAdd(description.trim());
      setDescription('');
    }
  };

  return (
    <div className="quick-add-container">
      <input
        type="text"
        placeholder="Voeg een taak toe..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        className="quick-add-input"
        aria-label="New task description"
      />
    </div>
  );
}
