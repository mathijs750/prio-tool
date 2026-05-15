## 2024-05-18 - Icon-Only Button Accessibility
**Learning:** Found several icon-only buttons across `TaskList` and `AddTaskModal` that relied solely on `title` attributes. Adding `aria-label` along with `aria-hidden="true"` on the internal icon elements (`<span class="material-icons">`) is critical for screen reader users to understand the button's purpose without hearing the raw ligature text (like "timer" or "check_circle"). Additionally, toggleable priority/size buttons benefit from `aria-pressed` to indicate their current state.
**Action:** Always ensure icon-only buttons have descriptive `aria-label` attributes and that the actual icon text/ligature is hidden from screen readers using `aria-hidden="true"`. Use `aria-pressed` for toggle states.

## 2024-06-25 - Mobile Keyboard Form Submissions
**Learning:** Found that `QuickAdd` used `onKeyDown` to detect the Enter key for form submissions. This is problematic for mobile users whose virtual keyboards might not send the expected Enter keycode consistently. Wrapping the input in a `<form>` and using `onSubmit` provides robust cross-device support out of the box, correctly handling mobile 'Go'/'Search'/'Enter' keys.
**Action:** Always wrap single text inputs intended for submission in a `<form>` element with an `onSubmit` handler, rather than relying on `onKeyDown` listeners, to provide robust mobile keyboard support.
