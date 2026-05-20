## 2024-05-18 - Icon-Only Button Accessibility
**Learning:** Found several icon-only buttons across `TaskList` and `AddTaskModal` that relied solely on `title` attributes. Adding `aria-label` along with `aria-hidden="true"` on the internal icon elements (`<span class="material-icons">`) is critical for screen reader users to understand the button's purpose without hearing the raw ligature text (like "timer" or "check_circle"). Additionally, toggleable priority/size buttons benefit from `aria-pressed` to indicate their current state.
**Action:** Always ensure icon-only buttons have descriptive `aria-label` attributes and that the actual icon text/ligature is hidden from screen readers using `aria-hidden="true"`. Use `aria-pressed` for toggle states.

## 2024-05-14 - Mobile Keyboard Accessibility
**Learning:** Found that the QuickAdd component relied on an `onKeyDown` listener for the Enter key to submit tasks. This can be problematic on mobile devices where virtual keyboards might not reliably trigger the 'Enter' keydown event. Wrapping the input in a `<form>` with an `onSubmit` handler provides native, robust cross-device support for form submission, particularly for mobile users.
**Action:** Always wrap text inputs intended for submission in `<form>` elements with an `onSubmit` handler rather than relying solely on keyboard event listeners.

## 2024-05-19 - Accessible Inline Error Validation
**Learning:** Found a native `alert()` being used for form validation when users attempt to add a 'Tree' sized task without subtasks in `AddTaskModal`. Native alerts are disruptive to user workflow and provide a poor experience, especially for screen reader users as they steal focus completely and abruptly. Replacing this with an inline validation message with `role="alert"` allows screen readers to announce the error without breaking focus context, while significantly improving the visual polish of the UI.
**Action:** Always prefer inline error states with `role="alert"` over native `alert()` dialogs when validating form submissions to ensure a non-disruptive, accessible, and localized user experience.
