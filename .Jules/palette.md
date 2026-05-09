## 2024-05-18 - Icon-Only Button Accessibility
**Learning:** Found several icon-only buttons across `TaskList` and `AddTaskModal` that relied solely on `title` attributes. Adding `aria-label` along with `aria-hidden="true"` on the internal icon elements (`<span class="material-icons">`) is critical for screen reader users to understand the button's purpose without hearing the raw ligature text (like "timer" or "check_circle"). Additionally, toggleable priority/size buttons benefit from `aria-pressed` to indicate their current state.
**Action:** Always ensure icon-only buttons have descriptive `aria-label` attributes and that the actual icon text/ligature is hidden from screen readers using `aria-hidden="true"`. Use `aria-pressed` for toggle states.

## 2024-05-24 - Mobile Keyboard Submission
**Learning:** Relied on `onKeyDown` (listening for "Enter") for the QuickAdd input, which doesn't reliably trigger submit behavior on mobile device virtual keyboards (where users tap "Go" or "Enter"). Wrapping inputs in a standard `<form>` element with an `onSubmit` handler provides robust cross-device support and natively triggers on mobile virtual keyboards.
**Action:** Always wrap text inputs in `<form>` elements with an `onSubmit` handler if they should support quick submission, rather than relying solely on `onKeyDown` listeners.
