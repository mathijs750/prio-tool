## 2024-05-18 - Icon-Only Button Accessibility
**Learning:** Found several icon-only buttons across `TaskList` and `AddTaskModal` that relied solely on `title` attributes. Adding `aria-label` along with `aria-hidden="true"` on the internal icon elements (`<span class="material-icons">`) is critical for screen reader users to understand the button's purpose without hearing the raw ligature text (like "timer" or "check_circle"). Additionally, toggleable priority/size buttons benefit from `aria-pressed` to indicate their current state.
**Action:** Always ensure icon-only buttons have descriptive `aria-label` attributes and that the actual icon text/ligature is hidden from screen readers using `aria-hidden="true"`. Use `aria-pressed` for toggle states.

## 2024-05-18 - Form Submission Accessibility
**Learning:** Found that the `QuickAdd` input used `onKeyDown` to detect the Enter key for submission without a wrapping `<form>`. This setup can fail on mobile virtual keyboards where the "Enter" key behavior is sometimes inconsistently mapped to keydown events. Wrapping inputs inside a standard `<form>` with an `onSubmit` handler provides universally robust cross-device support out of the box.
**Action:** Always wrap text inputs intended for submission in `<form>` elements and use an `onSubmit` handler instead of relying on manually wired `onKeyDown` key event listeners.
