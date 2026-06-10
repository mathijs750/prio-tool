## 2024-05-18 - Icon-Only Button Accessibility
**Learning:** Found several icon-only buttons across `TaskList` and `AddTaskModal` that relied solely on `title` attributes. Adding `aria-label` along with `aria-hidden="true"` on the internal icon elements (`<span class="material-icons">`) is critical for screen reader users to understand the button's purpose without hearing the raw ligature text (like "timer" or "check_circle"). Additionally, toggleable priority/size buttons benefit from `aria-pressed` to indicate their current state.
**Action:** Always ensure icon-only buttons have descriptive `aria-label` attributes and that the actual icon text/ligature is hidden from screen readers using `aria-hidden="true"`. Use `aria-pressed` for toggle states.

## 2024-05-14 - Mobile Keyboard Accessibility
**Learning:** Found that the QuickAdd component relied on an `onKeyDown` listener for the Enter key to submit tasks. This can be problematic on mobile devices where virtual keyboards might not reliably trigger the 'Enter' keydown event. Wrapping the input in a `<form>` with an `onSubmit` handler provides native, robust cross-device support for form submission, particularly for mobile users.
**Action:** Always wrap text inputs intended for submission in `<form>` elements with an `onSubmit` handler rather than relying solely on keyboard event listeners.

## 2024-05-20 - Keyboard Accessibility Focus States
**Learning:** Found that several interactive components (like `.icon-btn`, `.modal-actions button`) lacked explicit `:focus-visible` styles. Relying only on default browser outlines can lead to inconsistent or missing focus rings, making keyboard navigation difficult.
**Action:** Always include explicitly scoped `:focus-visible` styles (e.g., `outline: 2px solid var(--accent); outline-offset: 2px;`) for interactive components' specific classes in vanilla CSS projects to maintain visual consistency.
