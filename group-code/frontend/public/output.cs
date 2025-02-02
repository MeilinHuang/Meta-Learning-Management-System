/*
! tailwindcss v3.1.8 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured `sans` font-family by default.
*/

html {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  /* 3 */
  tab-size: 4;
  /* 3 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
*/

body {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0;
  /* 1 */
  color: inherit;
  /* 2 */
  border-top-width: 1px;
  /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured `mono` font family by default.
2. Correct the odd `em` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* 1 */
  font-size: 1em;
  /* 2 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent `sub` and `sup` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0;
  /* 1 */
  border-color: inherit;
  /* 2 */
  border-collapse: collapse;
  /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  font-weight: inherit;
  /* 1 */
  line-height: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to `inherit` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

[type='text'],[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select {
  -webkit-appearance: none;
          appearance: none;
  background-color: #fff;
  border-color: #6b7280;
  border-width: 1px;
  border-radius: 0px;
  padding-top: 0.5rem;
  padding-right: 0.75rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  --tw-shadow: 0 0 #0000;
}

[type='text']:focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #2563eb;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  border-color: #2563eb;
}

input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
  color: #6b7280;
  opacity: 1;
}

input::placeholder,textarea::placeholder {
  color: #6b7280;
  opacity: 1;
}

::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

::-webkit-date-and-time-value {
  min-height: 1.5em;
}

::-webkit-datetime-edit,::-webkit-datetime-edit-year-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-meridiem-field {
  padding-top: 0;
  padding-bottom: 0;
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
}

[multiple] {
  background-image: initial;
  background-position: initial;
  background-repeat: unset;
  background-size: initial;
  padding-right: 0.75rem;
  -webkit-print-color-adjust: unset;
          print-color-adjust: unset;
}

[type='checkbox'],[type='radio'] {
  -webkit-appearance: none;
          appearance: none;
  padding: 0;
  -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-user-select: none;
          user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  color: #2563eb;
  background-color: #fff;
  border-color: #6b7280;
  border-width: 1px;
  --tw-shadow: 0 0 #0000;
}

[type='checkbox'] {
  border-radius: 0px;
}

[type='radio'] {
  border-radius: 100%;
}

[type='checkbox']:focus,[type='radio']:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
  --tw-ring-offset-width: 2px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #2563eb;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}

[type='checkbox']:checked,[type='radio']:checked {
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

[type='checkbox']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

[type='radio']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
}

[type='checkbox']:checked:hover,[type='checkbox']:checked:focus,[type='radio']:checked:hover,[type='radio']:checked:focus {
  border-color: transparent;
  background-color: currentColor;
}

[type='checkbox']:indeterminate {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus {
  border-color: transparent;
  background-color: currentColor;
}

[type='file'] {
  background: unset;
  border-color: inherit;
  border-width: 0;
  border-radius: 0;
  padding: 0;
  font-size: unset;
  line-height: inherit;
}

[type='file']:focus {
  outline: 1px solid ButtonText;
  outline: 1px auto -webkit-focus-ring-color;
}

*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::-webkit-backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

.prose {
  color: var(--tw-prose-body);
  max-width: 65ch;
}

.prose :where([class~="lead"]):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-lead);
  font-size: 1.25em;
  line-height: 1.6;
  margin-top: 1.2em;
  margin-bottom: 1.2em;
}

.prose :where(a):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-links);
  text-decoration: underline;
  font-weight: 500;
}

.prose :where(strong):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-bold);
  font-weight: 600;
}

.prose :where(a strong):not(:where([class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(blockquote strong):not(:where([class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(thead th strong):not(:where([class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(ol):not(:where([class~="not-prose"] *)) {
  list-style-type: decimal;
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose :where(ol[type="A"]):not(:where([class~="not-prose"] *)) {
  list-style-type: upper-alpha;
}

.prose :where(ol[type="a"]):not(:where([class~="not-prose"] *)) {
  list-style-type: lower-alpha;
}

.prose :where(ol[type="A" s]):not(:where([class~="not-prose"] *)) {
  list-style-type: upper-alpha;
}

.prose :where(ol[type="a" s]):not(:where([class~="not-prose"] *)) {
  list-style-type: lower-alpha;
}

.prose :where(ol[type="I"]):not(:where([class~="not-prose"] *)) {
  list-style-type: upper-roman;
}

.prose :where(ol[type="i"]):not(:where([class~="not-prose"] *)) {
  list-style-type: lower-roman;
}

.prose :where(ol[type="I" s]):not(:where([class~="not-prose"] *)) {
  list-style-type: upper-roman;
}

.prose :where(ol[type="i" s]):not(:where([class~="not-prose"] *)) {
  list-style-type: lower-roman;
}

.prose :where(ol[type="1"]):not(:where([class~="not-prose"] *)) {
  list-style-type: decimal;
}

.prose :where(ul):not(:where([class~="not-prose"] *)) {
  list-style-type: disc;
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose :where(ol > li):not(:where([class~="not-prose"] *))::marker {
  font-weight: 400;
  color: var(--tw-prose-counters);
}

.prose :where(ul > li):not(:where([class~="not-prose"] *))::marker {
  color: var(--tw-prose-bullets);
}

.prose :where(hr):not(:where([class~="not-prose"] *)) {
  border-color: var(--tw-prose-hr);
  border-top-width: 1px;
  margin-top: 3em;
  margin-bottom: 3em;
}

.prose :where(blockquote):not(:where([class~="not-prose"] *)) {
  font-weight: 500;
  font-style: italic;
  color: var(--tw-prose-quotes);
  border-left-width: 0.25rem;
  border-left-color: var(--tw-prose-quote-borders);
  quotes: "\201C""\201D""\2018""\2019";
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}

.prose :where(blockquote p:first-of-type):not(:where([class~="not-prose"] *))::before {
  content: open-quote;
}

.prose :where(blockquote p:last-of-type):not(:where([class~="not-prose"] *))::after {
  content: close-quote;
}

.prose :where(h1):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 800;
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}

.prose :where(h1 strong):not(:where([class~="not-prose"] *)) {
  font-weight: 900;
  color: inherit;
}

.prose :where(h2):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 700;
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3333333;
}

.prose :where(h2 strong):not(:where([class~="not-prose"] *)) {
  font-weight: 800;
  color: inherit;
}

.prose :where(h3):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 600;
  font-size: 1.25em;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  line-height: 1.6;
}

.prose :where(h3 strong):not(:where([class~="not-prose"] *)) {
  font-weight: 700;
  color: inherit;
}

.prose :where(h4):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5;
}

.prose :where(h4 strong):not(:where([class~="not-prose"] *)) {
  font-weight: 700;
  color: inherit;
}

.prose :where(img):not(:where([class~="not-prose"] *)) {
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose :where(figure > *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
  margin-bottom: 0;
}

.prose :where(figcaption):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-captions);
  font-size: 0.875em;
  line-height: 1.4285714;
  margin-top: 0.8571429em;
}

.prose :where(code):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-code);
  font-weight: 600;
  font-size: 0.875em;
}

.prose :where(code):not(:where([class~="not-prose"] *))::before {
  content: "`";
}

.prose :where(code):not(:where([class~="not-prose"] *))::after {
  content: "`";
}

.prose :where(a code):not(:where([class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(h1 code):not(:where([class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(h2 code):not(:where([class~="not-prose"] *)) {
  color: inherit;
  font-size: 0.875em;
}

.prose :where(h3 code):not(:where([class~="not-prose"] *)) {
  color: inherit;
  font-size: 0.9em;
}

.prose :where(h4 code):not(:where([class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(blockquote code):not(:where([class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(thead th code):not(:where([class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(pre):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-pre-code);
  background-color: var(--tw-prose-pre-bg);
  overflow-x: auto;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.7142857;
  margin-top: 1.7142857em;
  margin-bottom: 1.7142857em;
  border-radius: 0.375rem;
  padding-top: 0.8571429em;
  padding-right: 1.1428571em;
  padding-bottom: 0.8571429em;
  padding-left: 1.1428571em;
}

.prose :where(pre code):not(:where([class~="not-prose"] *)) {
  background-color: transparent;
  border-width: 0;
  border-radius: 0;
  padding: 0;
  font-weight: inherit;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
}

.prose :where(pre code):not(:where([class~="not-prose"] *))::before {
  content: none;
}

.prose :where(pre code):not(:where([class~="not-prose"] *))::after {
  content: none;
}

.prose :where(table):not(:where([class~="not-prose"] *)) {
  width: 100%;
  table-layout: auto;
  text-align: left;
  margin-top: 2em;
  margin-bottom: 2em;
  font-size: 0.875em;
  line-height: 1.7142857;
}

.prose :where(thead):not(:where([class~="not-prose"] *)) {
  border-bottom-width: 1px;
  border-bottom-color: var(--tw-prose-th-borders);
}

.prose :where(thead th):not(:where([class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 600;
  vertical-align: bottom;
  padding-right: 0.5714286em;
  padding-bottom: 0.5714286em;
  padding-left: 0.5714286em;
}

.prose :where(tbody tr):not(:where([class~="not-prose"] *)) {
  border-bottom-width: 1px;
  border-bottom-color: var(--tw-prose-td-borders);
}

.prose :where(tbody tr:last-child):not(:where([class~="not-prose"] *)) {
  border-bottom-width: 0;
}

.prose :where(tbody td):not(:where([class~="not-prose"] *)) {
  vertical-align: baseline;
}

.prose :where(tfoot):not(:where([class~="not-prose"] *)) {
  border-top-width: 1px;
  border-top-color: var(--tw-prose-th-borders);
}

.prose :where(tfoot td):not(:where([class~="not-prose"] *)) {
  vertical-align: top;
}

.prose {
  --tw-prose-body: #374151;
  --tw-prose-headings: #111827;
  --tw-prose-lead: #4b5563;
  --tw-prose-links: #111827;
  --tw-prose-bold: #111827;
  --tw-prose-counters: #6b7280;
  --tw-prose-bullets: #d1d5db;
  --tw-prose-hr: #e5e7eb;
  --tw-prose-quotes: #111827;
  --tw-prose-quote-borders: #e5e7eb;
  --tw-prose-captions: #6b7280;
  --tw-prose-code: #111827;
  --tw-prose-pre-code: #e5e7eb;
  --tw-prose-pre-bg: #1f2937;
  --tw-prose-th-borders: #d1d5db;
  --tw-prose-td-borders: #e5e7eb;
  --tw-prose-invert-body: #d1d5db;
  --tw-prose-invert-headings: #fff;
  --tw-prose-invert-lead: #9ca3af;
  --tw-prose-invert-links: #fff;
  --tw-prose-invert-bold: #fff;
  --tw-prose-invert-counters: #9ca3af;
  --tw-prose-invert-bullets: #4b5563;
  --tw-prose-invert-hr: #374151;
  --tw-prose-invert-quotes: #f3f4f6;
  --tw-prose-invert-quote-borders: #374151;
  --tw-prose-invert-captions: #9ca3af;
  --tw-prose-invert-code: #fff;
  --tw-prose-invert-pre-code: #d1d5db;
  --tw-prose-invert-pre-bg: rgb(0 0 0 / 50%);
  --tw-prose-invert-th-borders: #4b5563;
  --tw-prose-invert-td-borders: #374151;
  font-size: 1rem;
  line-height: 1.75;
}

.prose :where(p):not(:where([class~="not-prose"] *)) {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose :where(video):not(:where([class~="not-prose"] *)) {
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose :where(figure):not(:where([class~="not-prose"] *)) {
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose :where(li):not(:where([class~="not-prose"] *)) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :where(ol > li):not(:where([class~="not-prose"] *)) {
  padding-left: 0.375em;
}

.prose :where(ul > li):not(:where([class~="not-prose"] *)) {
  padding-left: 0.375em;
}

.prose :where(.prose > ul > li p):not(:where([class~="not-prose"] *)) {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose :where(.prose > ul > li > *:first-child):not(:where([class~="not-prose"] *)) {
  margin-top: 1.25em;
}

.prose :where(.prose > ul > li > *:last-child):not(:where([class~="not-prose"] *)) {
  margin-bottom: 1.25em;
}

.prose :where(.prose > ol > li > *:first-child):not(:where([class~="not-prose"] *)) {
  margin-top: 1.25em;
}

.prose :where(.prose > ol > li > *:last-child):not(:where([class~="not-prose"] *)) {
  margin-bottom: 1.25em;
}

.prose :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~="not-prose"] *)) {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose :where(hr + *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(h2 + *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(h3 + *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(h4 + *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(thead th:first-child):not(:where([class~="not-prose"] *)) {
  padding-left: 0;
}

.prose :where(thead th:last-child):not(:where([class~="not-prose"] *)) {
  padding-right: 0;
}

.prose :where(tbody td, tfoot td):not(:where([class~="not-prose"] *)) {
  padding-top: 0.5714286em;
  padding-right: 0.5714286em;
  padding-bottom: 0.5714286em;
  padding-left: 0.5714286em;
}

.prose :where(tbody td:first-child, tfoot td:first-child):not(:where([class~="not-prose"] *)) {
  padding-left: 0;
}

.prose :where(tbody td:last-child, tfoot td:last-child):not(:where([class~="not-prose"] *)) {
  padding-right: 0;
}

.prose :where(.prose > :first-child):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(.prose > :last-child):not(:where([class~="not-prose"] *)) {
  margin-bottom: 0;
}

.prose-sm {
  font-size: 0.875rem;
  line-height: 1.7142857;
}

.prose-sm :where(p):not(:where([class~="not-prose"] *)) {
  margin-top: 1.1428571em;
  margin-bottom: 1.1428571em;
}

.prose-sm :where([class~="lead"]):not(:where([class~="not-prose"] *)) {
  font-size: 1.2857143em;
  line-height: 1.5555556;
  margin-top: 0.8888889em;
  margin-bottom: 0.8888889em;
}

.prose-sm :where(blockquote):not(:where([class~="not-prose"] *)) {
  margin-top: 1.3333333em;
  margin-bottom: 1.3333333em;
  padding-left: 1.1111111em;
}

.prose-sm :where(h1):not(:where([class~="not-prose"] *)) {
  font-size: 2.1428571em;
  margin-top: 0;
  margin-bottom: 0.8em;
  line-height: 1.2;
}

.prose-sm :where(h2):not(:where([class~="not-prose"] *)) {
  font-size: 1.4285714em;
  margin-top: 1.6em;
  margin-bottom: 0.8em;
  line-height: 1.4;
}

.prose-sm :where(h3):not(:where([class~="not-prose"] *)) {
  font-size: 1.2857143em;
  margin-top: 1.5555556em;
  margin-bottom: 0.4444444em;
  line-height: 1.5555556;
}

.prose-sm :where(h4):not(:where([class~="not-prose"] *)) {
  margin-top: 1.4285714em;
  margin-bottom: 0.5714286em;
  line-height: 1.4285714;
}

.prose-sm :where(img):not(:where([class~="not-prose"] *)) {
  margin-top: 1.7142857em;
  margin-bottom: 1.7142857em;
}

.prose-sm :where(video):not(:where([class~="not-prose"] *)) {
  margin-top: 1.7142857em;
  margin-bottom: 1.7142857em;
}

.prose-sm :where(figure):not(:where([class~="not-prose"] *)) {
  margin-top: 1.7142857em;
  margin-bottom: 1.7142857em;
}

.prose-sm :where(figure > *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
  margin-bottom: 0;
}

.prose-sm :where(figcaption):not(:where([class~="not-prose"] *)) {
  font-size: 0.8571429em;
  line-height: 1.3333333;
  margin-top: 0.6666667em;
}

.prose-sm :where(code):not(:where([class~="not-prose"] *)) {
  font-size: 0.8571429em;
}

.prose-sm :where(h2 code):not(:where([class~="not-prose"] *)) {
  font-size: 0.9em;
}

.prose-sm :where(h3 code):not(:where([class~="not-prose"] *)) {
  font-size: 0.8888889em;
}

.prose-sm :where(pre):not(:where([class~="not-prose"] *)) {
  font-size: 0.8571429em;
  line-height: 1.6666667;
  margin-top: 1.6666667em;
  margin-bottom: 1.6666667em;
  border-radius: 0.25rem;
  padding-top: 0.6666667em;
  padding-right: 1em;
  padding-bottom: 0.6666667em;
  padding-left: 1em;
}

.prose-sm :where(ol):not(:where([class~="not-prose"] *)) {
  margin-top: 1.1428571em;
  margin-bottom: 1.1428571em;
  padding-left: 1.5714286em;
}

.prose-sm :where(ul):not(:where([class~="not-prose"] *)) {
  margin-top: 1.1428571em;
  margin-bottom: 1.1428571em;
  padding-left: 1.5714286em;
}

.prose-sm :where(li):not(:where([class~="not-prose"] *)) {
  margin-top: 0.2857143em;
  margin-bottom: 0.2857143em;
}

.prose-sm :where(ol > li):not(:where([class~="not-prose"] *)) {
  padding-left: 0.4285714em;
}

.prose-sm :where(ul > li):not(:where([class~="not-prose"] *)) {
  padding-left: 0.4285714em;
}

.prose-sm :where(.prose-sm > ul > li p):not(:where([class~="not-prose"] *)) {
  margin-top: 0.5714286em;
  margin-bottom: 0.5714286em;
}

.prose-sm :where(.prose-sm > ul > li > *:first-child):not(:where([class~="not-prose"] *)) {
  margin-top: 1.1428571em;
}

.prose-sm :where(.prose-sm > ul > li > *:last-child):not(:where([class~="not-prose"] *)) {
  margin-bottom: 1.1428571em;
}

.prose-sm :where(.prose-sm > ol > li > *:first-child):not(:where([class~="not-prose"] *)) {
  margin-top: 1.1428571em;
}

.prose-sm :where(.prose-sm > ol > li > *:last-child):not(:where([class~="not-prose"] *)) {
  margin-bottom: 1.1428571em;
}

.prose-sm :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~="not-prose"] *)) {
  margin-top: 0.5714286em;
  margin-bottom: 0.5714286em;
}

.prose-sm :where(hr):not(:where([class~="not-prose"] *)) {
  margin-top: 2.8571429em;
  margin-bottom: 2.8571429em;
}

.prose-sm :where(hr + *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose-sm :where(h2 + *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose-sm :where(h3 + *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose-sm :where(h4 + *):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose-sm :where(table):not(:where([class~="not-prose"] *)) {
  font-size: 0.8571429em;
  line-height: 1.5;
}

.prose-sm :where(thead th):not(:where([class~="not-prose"] *)) {
  padding-right: 1em;
  padding-bottom: 0.6666667em;
  padding-left: 1em;
}

.prose-sm :where(thead th:first-child):not(:where([class~="not-prose"] *)) {
  padding-left: 0;
}

.prose-sm :where(thead th:last-child):not(:where([class~="not-prose"] *)) {
  padding-right: 0;
}

.prose-sm :where(tbody td, tfoot td):not(:where([class~="not-prose"] *)) {
  padding-top: 0.6666667em;
  padding-right: 1em;
  padding-bottom: 0.6666667em;
  padding-left: 1em;
}

.prose-sm :where(tbody td:first-child, tfoot td:first-child):not(:where([class~="not-prose"] *)) {
  padding-left: 0;
}

.prose-sm :where(tbody td:last-child, tfoot td:last-child):not(:where([class~="not-prose"] *)) {
  padding-right: 0;
}

.prose-sm :where(.prose-sm > :first-child):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
}

.prose-sm :where(.prose-sm > :last-child):not(:where([class~="not-prose"] *)) {
  margin-bottom: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.pointer-events-none {
  pointer-events: none;
}

.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.sticky {
  position: -webkit-sticky;
  position: sticky;
}

.inset-0 {
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.inset-y-0 {
  top: 0px;
  bottom: 0px;
}

.inset-x-0 {
  left: 0px;
  right: 0px;
}

.top-0 {
  top: 0px;
}

.left-0 {
  left: 0px;
}

.right-0 {
  right: 0px;
}

.right-full {
  right: 100%;
}

.left-full {
  left: 100%;
}

.bottom-0 {
  bottom: 0px;
}

.z-10 {
  z-index: 10;
}

.z-40 {
  z-index: 40;
}

.z-0 {
  z-index: 0;
}

.z-\[-1\] {
  z-index: -1;
}

.-m-2 {
  margin: -0.5rem;
}

.m-3 {
  margin: 0.75rem;
}

.-m-0\.5 {
  margin: -0.125rem;
}

.-m-0 {
  margin: -0px;
}

.m-2 {
  margin: 0.5rem;
}

.-m-2\.5 {
  margin: -0.625rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.-my-2 {
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
}

.-mx-4 {
  margin-left: -1rem;
  margin-right: -1rem;
}

.my-10 {
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
}

.-mx-1\.5 {
  margin-left: -0.375rem;
  margin-right: -0.375rem;
}

.-my-1\.5 {
  margin-top: -0.375rem;
  margin-bottom: -0.375rem;
}

.-mx-1 {
  margin-left: -0.25rem;
  margin-right: -0.25rem;
}

.-my-1 {
  margin-top: -0.25rem;
  margin-bottom: -0.25rem;
}

.my-5 {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.mt-8 {
  margin-top: 2rem;
}

.mt-5 {
  margin-top: 1.25rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.ml-4 {
  margin-left: 1rem;
}

.ml-3 {
  margin-left: 0.75rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.-mr-2 {
  margin-right: -0.5rem;
}

.mt-16 {
  margin-top: 4rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.-mr-12 {
  margin-right: -3rem;
}

.ml-1 {
  margin-left: 0.25rem;
}

.ml-5 {
  margin-left: 1.25rem;
}

.-mr-3 {
  margin-right: -0.75rem;
}

.ml-auto {
  margin-left: auto;
}

.mr-1\.5 {
  margin-right: 0.375rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

.-ml-1 {
  margin-left: -0.25rem;
}

.-mr-1 {
  margin-right: -0.25rem;
}

.mb-10 {
  margin-bottom: 2.5rem;
}

.block {
  display: block;
}

.inline-block {
  display: inline-block;
}

.flex {
  display: flex;
}

.inline-flex {
  display: inline-flex;
}

.table {
  display: table;
}

.grid {
  display: grid;
}

.hidden {
  display: none;
}

.h-full {
  height: 100%;
}

.h-12 {
  height: 3rem;
}

.h-4 {
  height: 1rem;
}

.h-8 {
  height: 2rem;
}

.h-6 {
  height: 1.5rem;
}

.h-16 {
  height: 4rem;
}

.h-5 {
  height: 1.25rem;
}

.h-96 {
  height: 24rem;
}

.h-10 {
  height: 2.5rem;
}

.h-0 {
  height: 0px;
}

.h-screen {
  height: 100vh;
}

.h-\[18px\] {
  height: 18px;
}

.h-14 {
  height: 3.5rem;
}

.min-h-full {
  min-height: 100%;
}

.min-h-0 {
  min-height: 0px;
}

.w-full {
  width: 100%;
}

.w-auto {
  width: auto;
}

.w-4 {
  width: 1rem;
}

.w-6 {
  width: 1.5rem;
}

.w-5 {
  width: 1.25rem;
}

.w-8 {
  width: 2rem;
}

.w-48 {
  width: 12rem;
}

.w-10 {
  width: 2.5rem;
}

.w-14 {
  width: 3.5rem;
}

.w-64 {
  width: 16rem;
}

.w-12 {
  width: 3rem;
}

.w-56 {
  width: 14rem;
}

.w-1\/4 {
  width: 25%;
}

.w-3\/4 {
  width: 75%;
}

.w-\[18px\] {
  width: 18px;
}

.min-w-full {
  min-width: 100%;
}

.min-w-0 {
  min-width: 0px;
}

.max-w-2xl {
  max-width: 42rem;
}

.max-w-xs {
  max-width: 20rem;
}

.max-w-7xl {
  max-width: 80rem;
}

.max-w-md {
  max-width: 28rem;
}

.max-w-4xl {
  max-width: 56rem;
}

.max-w-none {
  max-width: none;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-none {
  flex: none;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.shrink {
  flex-shrink: 1;
}

.flex-grow {
  flex-grow: 1;
}

.origin-top-right {
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.translate-y-1\/4 {
  --tw-translate-y: 25%;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-1\/4 {
  --tw-translate-x: 25%;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-3\/4 {
  --tw-translate-y: -75%;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-1\/4 {
  --tw-translate-x: -25%;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-full {
  --tw-translate-x: -100%;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-0 {
  --tw-translate-x: 0px;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-4 {
  --tw-translate-y: 1rem;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-0 {
  --tw-translate-y: 0px;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-95 {
  --tw-scale-x: .95;
  --tw-scale-y: .95;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-100 {
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.transform {
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}

.animate-spin {
  -webkit-animation: spin 1s linear infinite;
          animation: spin 1s linear infinite;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-wait {
  cursor: wait;
}

.appearance-none {
  -webkit-appearance: none;
          appearance: none;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.flex-row {
  flex-direction: row;
}

.flex-row-reverse {
  flex-direction: row-reverse;
}

.flex-col {
  flex-direction: column;
}

.items-start {
  align-items: flex-start;
}

.items-end {
  align-items: flex-end;
}

.items-center {
  align-items: center;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-y-6 {
  row-gap: 1.5rem;
}

.gap-x-4 {
  -webkit-column-gap: 1rem;
          column-gap: 1rem;
}

.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
}

.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}

.space-x-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.75rem * var(--tw-space-x-reverse));
  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
}

.space-y-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(2rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(2rem * var(--tw-space-y-reverse));
}

.space-x-5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(1.25rem * var(--tw-space-x-reverse));
  margin-left: calc(1.25rem * calc(1 - var(--tw-space-x-reverse)));
}

.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}

.divide-gray-300 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-divide-opacity));
}

.divide-gray-200 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-divide-opacity));
}

.divide-gray-100 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-divide-opacity));
}

.self-center {
  align-self: center;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-x-auto {
  overflow-x: auto;
}

.overflow-y-auto {
  overflow-y: auto;
}

.overflow-y-scroll {
  overflow-y: scroll;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.rounded-md {
  border-radius: 0.375rem;
}

.rounded {
  border-radius: 0.25rem;
}

.rounded-full {
  border-radius: 9999px;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-none {
  border-radius: 0px;
}

.rounded-r-md {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.border {
  border-width: 1px;
}

.border-4 {
  border-width: 4px;
}

.border-2 {
  border-width: 2px;
}

.border-t {
  border-top-width: 1px;
}

.border-r {
  border-right-width: 1px;
}

.border-b {
  border-bottom-width: 1px;
}

.border-dashed {
  border-style: dashed;
}

.border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity));
}

.border-transparent {
  border-color: transparent;
}

.border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity));
}

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.bg-gray-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity));
}

.bg-primary {
  --tw-bg-opacity: 1;
  background-color: rgb(6 182 212 / var(--tw-bg-opacity));
}

.bg-indigo-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity));
}

.bg-indigo-800 {
  --tw-bg-opacity: 1;
  background-color: rgb(55 48 163 / var(--tw-bg-opacity));
}

.bg-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity));
}

.bg-gray-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(75 85 99 / var(--tw-bg-opacity));
}

.bg-red-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity));
}

.bg-gray-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(107 114 128 / var(--tw-bg-opacity));
}

.bg-indigo-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(224 231 255 / var(--tw-bg-opacity));
}

.bg-slate-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(248 250 252 / var(--tw-bg-opacity));
}

.bg-opacity-75 {
  --tw-bg-opacity: 0.75;
}

.fill-blue-600 {
  fill: #2563eb;
}

.p-1 {
  padding: 0.25rem;
}

.p-2 {
  padding: 0.5rem;
}

.p-4 {
  padding: 1rem;
}

.p-0\.5 {
  padding: 0.125rem;
}

.p-0 {
  padding: 0px;
}

.p-1\.5 {
  padding: 0.375rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.py-3\.5 {
  padding-top: 0.875rem;
  padding-bottom: 0.875rem;
}

.py-1\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

.pt-5 {
  padding-top: 1.25rem;
}

.pb-4 {
  padding-bottom: 1rem;
}

.pl-8 {
  padding-left: 2rem;
}

.pr-3 {
  padding-right: 0.75rem;
}

.pt-6 {
  padding-top: 1.5rem;
}

.pb-16 {
  padding-bottom: 4rem;
}

.pt-4 {
  padding-top: 1rem;
}

.pt-2 {
  padding-top: 0.5rem;
}

.pb-3 {
  padding-bottom: 0.75rem;
}

.pl-4 {
  padding-left: 1rem;
}

.pl-3 {
  padding-left: 0.75rem;
}

.pr-4 {
  padding-right: 1rem;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.align-middle {
  vertical-align: middle;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.leading-6 {
  line-height: 1.5rem;
}

.leading-4 {
  line-height: 1rem;
}

.leading-7 {
  line-height: 1.75rem;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
}

.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity));
}

.text-black {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity));
}

.text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity));
}

.text-red-700 {
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity));
}

.text-indigo-600 {
  --tw-text-opacity: 1;
  color: rgb(79 70 229 / var(--tw-text-opacity));
}

.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}

.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.text-green-600 {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity));
}

.text-red-600 {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity));
}

.text-indigo-300 {
  --tw-text-opacity: 1;
  color: rgb(165 180 252 / var(--tw-text-opacity));
}

.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
}

.text-gray-200 {
  --tw-text-opacity: 1;
  color: rgb(229 231 235 / var(--tw-text-opacity));
}

.text-primary {
  --tw-text-opacity: 1;
  color: rgb(6 182 212 / var(--tw-text-opacity));
}

.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity));
}

.text-red-400 {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity));
}

.text-red-800 {
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity));
}

.text-yellow-700 {
  --tw-text-opacity: 1;
  color: rgb(161 98 7 / var(--tw-text-opacity));
}

.placeholder-gray-400::-webkit-input-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(156 163 175 / var(--tw-placeholder-opacity));
}

.placeholder-gray-400::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(156 163 175 / var(--tw-placeholder-opacity));
}

.placeholder-gray-500::-webkit-input-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(107 114 128 / var(--tw-placeholder-opacity));
}

.placeholder-gray-500::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(107 114 128 / var(--tw-placeholder-opacity));
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.ring-1 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-black {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(0 0 0 / var(--tw-ring-opacity));
}

.ring-opacity-5 {
  --tw-ring-opacity: 0.05;
}

.filter {
  -webkit-filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
          filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, -webkit-transform, -webkit-filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-transform, -webkit-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-100 {
  transition-duration: 100ms;
}

.duration-75 {
  transition-duration: 75ms;
}

.duration-150 {
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.ease-linear {
  transition-timing-function: linear;
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

input[type='text']:focus {
  box-shadow: none;
}

.focus-within\:text-gray-600:focus-within {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity));
}

.focus-within\:ring-2:focus-within {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-within\:ring-inset:focus-within {
  --tw-ring-inset: inset;
}

.focus-within\:ring-indigo-600:focus-within {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(79 70 229 / var(--tw-ring-opacity));
}

.hover\:bg-indigo-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(67 56 202 / var(--tw-bg-opacity));
}

.hover\:bg-indigo-600:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity));
}

.hover\:bg-gray-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity));
}

.hover\:bg-gray-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity));
}

.hover\:bg-gray-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
}

.hover\:bg-red-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity));
}

.hover\:text-indigo-500:hover {
  --tw-text-opacity: 1;
  color: rgb(99 102 241 / var(--tw-text-opacity));
}

.hover\:text-gray-500:hover {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity));
}

.hover\:text-gray-900:hover {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
}

.hover\:text-indigo-900:hover {
  --tw-text-opacity: 1;
  color: rgb(49 46 129 / var(--tw-text-opacity));
}

.hover\:text-gray-600:hover {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity));
}

.hover\:underline:hover {
  text-decoration-line: underline;
}

.focus\:border-indigo-500:focus {
  --tw-border-opacity: 1;
  border-color: rgb(99 102 241 / var(--tw-border-opacity));
}

.focus\:border-transparent:focus {
  border-color: transparent;
}

.focus\:placeholder-gray-400:focus::-webkit-input-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(156 163 175 / var(--tw-placeholder-opacity));
}

.focus\:placeholder-gray-400:focus::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(156 163 175 / var(--tw-placeholder-opacity));
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-0:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-inset:focus {
  --tw-ring-inset: inset;
}

.focus\:ring-indigo-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(99 102 241 / var(--tw-ring-opacity));
}

.focus\:ring-white:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));
}

.focus\:ring-red-600:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(220 38 38 / var(--tw-ring-opacity));
}

.focus\:ring-gray-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity));
}

.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}

.focus\:ring-offset-red-50:focus {
  --tw-ring-offset-color: #fef2f2;
}

.focus-visible\:ring-2:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-visible\:ring-indigo-500:focus-visible {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(99 102 241 / var(--tw-ring-opacity));
}

.focus-visible\:ring-offset-2:focus-visible {
  --tw-ring-offset-width: 2px;
}

.focus-visible\:ring-offset-gray-100:focus-visible {
  --tw-ring-offset-color: #f3f4f6;
}

.group:hover .group-hover\:text-gray-900 {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
}

.group:hover .group-hover\:text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity));
}

@media (prefers-color-scheme: dark) {
  .dark\:text-gray-600 {
    --tw-text-opacity: 1;
    color: rgb(75 85 99 / var(--tw-text-opacity));
  }
}

@media (min-width: 640px) {
  .sm\:prose-sm {
    font-size: 0.875rem;
    line-height: 1.7142857;
  }

  .sm\:prose-sm :where(p):not(:where([class~="not-prose"] *)) {
    margin-top: 1.1428571em;
    margin-bottom: 1.1428571em;
  }

  .sm\:prose-sm :where([class~="lead"]):not(:where([class~="not-prose"] *)) {
    font-size: 1.2857143em;
    line-height: 1.5555556;
    margin-top: 0.8888889em;
    margin-bottom: 0.8888889em;
  }

  .sm\:prose-sm :where(blockquote):not(:where([class~="not-prose"] *)) {
    margin-top: 1.3333333em;
    margin-bottom: 1.3333333em;
    padding-left: 1.1111111em;
  }

  .sm\:prose-sm :where(h1):not(:where([class~="not-prose"] *)) {
    font-size: 2.1428571em;
    margin-top: 0;
    margin-bottom: 0.8em;
    line-height: 1.2;
  }

  .sm\:prose-sm :where(h2):not(:where([class~="not-prose"] *)) {
    font-size: 1.4285714em;
    margin-top: 1.6em;
    margin-bottom: 0.8em;
    line-height: 1.4;
  }

  .sm\:prose-sm :where(h3):not(:where([class~="not-prose"] *)) {
    font-size: 1.2857143em;
    margin-top: 1.5555556em;
    margin-bottom: 0.4444444em;
    line-height: 1.5555556;
  }

  .sm\:prose-sm :where(h4):not(:where([class~="not-prose"] *)) {
    margin-top: 1.4285714em;
    margin-bottom: 0.5714286em;
    line-height: 1.4285714;
  }

  .sm\:prose-sm :where(img):not(:where([class~="not-prose"] *)) {
    margin-top: 1.7142857em;
    margin-bottom: 1.7142857em;
  }

  .sm\:prose-sm :where(video):not(:where([class~="not-prose"] *)) {
    margin-top: 1.7142857em;
    margin-bottom: 1.7142857em;
  }

  .sm\:prose-sm :where(figure):not(:where([class~="not-prose"] *)) {
    margin-top: 1.7142857em;
    margin-bottom: 1.7142857em;
  }

  .sm\:prose-sm :where(figure > *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
    margin-bottom: 0;
  }

  .sm\:prose-sm :where(figcaption):not(:where([class~="not-prose"] *)) {
    font-size: 0.8571429em;
    line-height: 1.3333333;
    margin-top: 0.6666667em;
  }

  .sm\:prose-sm :where(code):not(:where([class~="not-prose"] *)) {
    font-size: 0.8571429em;
  }

  .sm\:prose-sm :where(h2 code):not(:where([class~="not-prose"] *)) {
    font-size: 0.9em;
  }

  .sm\:prose-sm :where(h3 code):not(:where([class~="not-prose"] *)) {
    font-size: 0.8888889em;
  }

  .sm\:prose-sm :where(pre):not(:where([class~="not-prose"] *)) {
    font-size: 0.8571429em;
    line-height: 1.6666667;
    margin-top: 1.6666667em;
    margin-bottom: 1.6666667em;
    border-radius: 0.25rem;
    padding-top: 0.6666667em;
    padding-right: 1em;
    padding-bottom: 0.6666667em;
    padding-left: 1em;
  }

  .sm\:prose-sm :where(ol):not(:where([class~="not-prose"] *)) {
    margin-top: 1.1428571em;
    margin-bottom: 1.1428571em;
    padding-left: 1.5714286em;
  }

  .sm\:prose-sm :where(ul):not(:where([class~="not-prose"] *)) {
    margin-top: 1.1428571em;
    margin-bottom: 1.1428571em;
    padding-left: 1.5714286em;
  }

  .sm\:prose-sm :where(li):not(:where([class~="not-prose"] *)) {
    margin-top: 0.2857143em;
    margin-bottom: 0.2857143em;
  }

  .sm\:prose-sm :where(ol > li):not(:where([class~="not-prose"] *)) {
    padding-left: 0.4285714em;
  }

  .sm\:prose-sm :where(ul > li):not(:where([class~="not-prose"] *)) {
    padding-left: 0.4285714em;
  }

  .sm\:prose-sm :where(.sm\:prose-sm > ul > li p):not(:where([class~="not-prose"] *)) {
    margin-top: 0.5714286em;
    margin-bottom: 0.5714286em;
  }

  .sm\:prose-sm :where(.sm\:prose-sm > ul > li > *:first-child):not(:where([class~="not-prose"] *)) {
    margin-top: 1.1428571em;
  }

  .sm\:prose-sm :where(.sm\:prose-sm > ul > li > *:last-child):not(:where([class~="not-prose"] *)) {
    margin-bottom: 1.1428571em;
  }

  .sm\:prose-sm :where(.sm\:prose-sm > ol > li > *:first-child):not(:where([class~="not-prose"] *)) {
    margin-top: 1.1428571em;
  }

  .sm\:prose-sm :where(.sm\:prose-sm > ol > li > *:last-child):not(:where([class~="not-prose"] *)) {
    margin-bottom: 1.1428571em;
  }

  .sm\:prose-sm :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~="not-prose"] *)) {
    margin-top: 0.5714286em;
    margin-bottom: 0.5714286em;
  }

  .sm\:prose-sm :where(hr):not(:where([class~="not-prose"] *)) {
    margin-top: 2.8571429em;
    margin-bottom: 2.8571429em;
  }

  .sm\:prose-sm :where(hr + *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .sm\:prose-sm :where(h2 + *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .sm\:prose-sm :where(h3 + *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .sm\:prose-sm :where(h4 + *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .sm\:prose-sm :where(table):not(:where([class~="not-prose"] *)) {
    font-size: 0.8571429em;
    line-height: 1.5;
  }

  .sm\:prose-sm :where(thead th):not(:where([class~="not-prose"] *)) {
    padding-right: 1em;
    padding-bottom: 0.6666667em;
    padding-left: 1em;
  }

  .sm\:prose-sm :where(thead th:first-child):not(:where([class~="not-prose"] *)) {
    padding-left: 0;
  }

  .sm\:prose-sm :where(thead th:last-child):not(:where([class~="not-prose"] *)) {
    padding-right: 0;
  }

  .sm\:prose-sm :where(tbody td, tfoot td):not(:where([class~="not-prose"] *)) {
    padding-top: 0.6666667em;
    padding-right: 1em;
    padding-bottom: 0.6666667em;
    padding-left: 1em;
  }

  .sm\:prose-sm :where(tbody td:first-child, tfoot td:first-child):not(:where([class~="not-prose"] *)) {
    padding-left: 0;
  }

  .sm\:prose-sm :where(tbody td:last-child, tfoot td:last-child):not(:where([class~="not-prose"] *)) {
    padding-right: 0;
  }

  .sm\:prose-sm :where(.sm\:prose-sm > :first-child):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .sm\:prose-sm :where(.sm\:prose-sm > :last-child):not(:where([class~="not-prose"] *)) {
    margin-bottom: 0;
  }

  .sm\:absolute {
    position: absolute;
  }

  .sm\:inset-y-0 {
    top: 0px;
    bottom: 0px;
  }

  .sm\:col-span-2 {
    grid-column: span 2 / span 2;
  }

  .sm\:col-span-4 {
    grid-column: span 4 / span 4;
  }

  .sm\:col-span-6 {
    grid-column: span 6 / span 6;
  }

  .sm\:col-start-2 {
    grid-column-start: 2;
  }

  .sm\:col-start-1 {
    grid-column-start: 1;
  }

  .sm\:mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .sm\:-mx-6 {
    margin-left: -1.5rem;
    margin-right: -1.5rem;
  }

  .sm\:my-8 {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .sm\:mt-0 {
    margin-top: 0px;
  }

  .sm\:ml-3 {
    margin-left: 0.75rem;
  }

  .sm\:mt-24 {
    margin-top: 6rem;
  }

  .sm\:ml-16 {
    margin-left: 4rem;
  }

  .sm\:mt-5 {
    margin-top: 1.25rem;
  }

  .sm\:mt-6 {
    margin-top: 1.5rem;
  }

  .sm\:block {
    display: block;
  }

  .sm\:flex {
    display: flex;
  }

  .sm\:grid {
    display: grid;
  }

  .sm\:hidden {
    display: none;
  }

  .sm\:h-full {
    height: 100%;
  }

  .sm\:h-10 {
    height: 2.5rem;
  }

  .sm\:w-full {
    width: 100%;
  }

  .sm\:w-auto {
    width: auto;
  }

  .sm\:max-w-md {
    max-width: 28rem;
  }

  .sm\:max-w-sm {
    max-width: 24rem;
  }

  .sm\:max-w-lg {
    max-width: 32rem;
  }

  .sm\:flex-auto {
    flex: 1 1 auto;
  }

  .sm\:flex-none {
    flex: none;
  }

  .sm\:translate-y-0 {
    --tw-translate-y: 0px;
    -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
            transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .sm\:scale-95 {
    --tw-scale-x: .95;
    --tw-scale-y: .95;
    -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
            transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .sm\:scale-100 {
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
            transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .sm\:grid-flow-row-dense {
    grid-auto-flow: row dense;
  }

  .sm\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .sm\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .sm\:grid-cols-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sm\:flex-row {
    flex-direction: row;
  }

  .sm\:flex-wrap {
    flex-wrap: wrap;
  }

  .sm\:items-center {
    align-items: center;
  }

  .sm\:justify-center {
    justify-content: center;
  }

  .sm\:gap-4 {
    gap: 1rem;
  }

  .sm\:gap-3 {
    gap: 0.75rem;
  }

  .sm\:space-x-6 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(1.5rem * var(--tw-space-x-reverse));
    margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));
  }

  .sm\:truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sm\:rounded-lg {
    border-radius: 0.5rem;
  }

  .sm\:p-6 {
    padding: 1.5rem;
  }

  .sm\:p-0 {
    padding: 0px;
  }

  .sm\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .sm\:px-10 {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .sm\:px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .sm\:pb-24 {
    padding-bottom: 6rem;
  }

  .sm\:pl-6 {
    padding-left: 1.5rem;
  }

  .sm\:pr-6 {
    padding-right: 1.5rem;
  }

  .sm\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .sm\:text-5xl {
    font-size: 3rem;
    line-height: 1;
  }

  .sm\:text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .sm\:text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .sm\:tracking-tight {
    letter-spacing: -0.025em;
  }

  .sm\:shadow {
    --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
}

@media (min-width: 768px) {
  .md\:prose-base {
    font-size: 1rem;
    line-height: 1.75;
  }

  .md\:prose-base :where(p):not(:where([class~="not-prose"] *)) {
    margin-top: 1.25em;
    margin-bottom: 1.25em;
  }

  .md\:prose-base :where([class~="lead"]):not(:where([class~="not-prose"] *)) {
    font-size: 1.25em;
    line-height: 1.6;
    margin-top: 1.2em;
    margin-bottom: 1.2em;
  }

  .md\:prose-base :where(blockquote):not(:where([class~="not-prose"] *)) {
    margin-top: 1.6em;
    margin-bottom: 1.6em;
    padding-left: 1em;
  }

  .md\:prose-base :where(h1):not(:where([class~="not-prose"] *)) {
    font-size: 2.25em;
    margin-top: 0;
    margin-bottom: 0.8888889em;
    line-height: 1.1111111;
  }

  .md\:prose-base :where(h2):not(:where([class~="not-prose"] *)) {
    font-size: 1.5em;
    margin-top: 2em;
    margin-bottom: 1em;
    line-height: 1.3333333;
  }

  .md\:prose-base :where(h3):not(:where([class~="not-prose"] *)) {
    font-size: 1.25em;
    margin-top: 1.6em;
    margin-bottom: 0.6em;
    line-height: 1.6;
  }

  .md\:prose-base :where(h4):not(:where([class~="not-prose"] *)) {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    line-height: 1.5;
  }

  .md\:prose-base :where(img):not(:where([class~="not-prose"] *)) {
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .md\:prose-base :where(video):not(:where([class~="not-prose"] *)) {
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .md\:prose-base :where(figure):not(:where([class~="not-prose"] *)) {
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .md\:prose-base :where(figure > *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
    margin-bottom: 0;
  }

  .md\:prose-base :where(figcaption):not(:where([class~="not-prose"] *)) {
    font-size: 0.875em;
    line-height: 1.4285714;
    margin-top: 0.8571429em;
  }

  .md\:prose-base :where(code):not(:where([class~="not-prose"] *)) {
    font-size: 0.875em;
  }

  .md\:prose-base :where(h2 code):not(:where([class~="not-prose"] *)) {
    font-size: 0.875em;
  }

  .md\:prose-base :where(h3 code):not(:where([class~="not-prose"] *)) {
    font-size: 0.9em;
  }

  .md\:prose-base :where(pre):not(:where([class~="not-prose"] *)) {
    font-size: 0.875em;
    line-height: 1.7142857;
    margin-top: 1.7142857em;
    margin-bottom: 1.7142857em;
    border-radius: 0.375rem;
    padding-top: 0.8571429em;
    padding-right: 1.1428571em;
    padding-bottom: 0.8571429em;
    padding-left: 1.1428571em;
  }

  .md\:prose-base :where(ol):not(:where([class~="not-prose"] *)) {
    margin-top: 1.25em;
    margin-bottom: 1.25em;
    padding-left: 1.625em;
  }

  .md\:prose-base :where(ul):not(:where([class~="not-prose"] *)) {
    margin-top: 1.25em;
    margin-bottom: 1.25em;
    padding-left: 1.625em;
  }

  .md\:prose-base :where(li):not(:where([class~="not-prose"] *)) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  .md\:prose-base :where(ol > li):not(:where([class~="not-prose"] *)) {
    padding-left: 0.375em;
  }

  .md\:prose-base :where(ul > li):not(:where([class~="not-prose"] *)) {
    padding-left: 0.375em;
  }

  .md\:prose-base :where(.md\:prose-base > ul > li p):not(:where([class~="not-prose"] *)) {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
  }

  .md\:prose-base :where(.md\:prose-base > ul > li > *:first-child):not(:where([class~="not-prose"] *)) {
    margin-top: 1.25em;
  }

  .md\:prose-base :where(.md\:prose-base > ul > li > *:last-child):not(:where([class~="not-prose"] *)) {
    margin-bottom: 1.25em;
  }

  .md\:prose-base :where(.md\:prose-base > ol > li > *:first-child):not(:where([class~="not-prose"] *)) {
    margin-top: 1.25em;
  }

  .md\:prose-base :where(.md\:prose-base > ol > li > *:last-child):not(:where([class~="not-prose"] *)) {
    margin-bottom: 1.25em;
  }

  .md\:prose-base :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~="not-prose"] *)) {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
  }

  .md\:prose-base :where(hr):not(:where([class~="not-prose"] *)) {
    margin-top: 3em;
    margin-bottom: 3em;
  }

  .md\:prose-base :where(hr + *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .md\:prose-base :where(h2 + *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .md\:prose-base :where(h3 + *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .md\:prose-base :where(h4 + *):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .md\:prose-base :where(table):not(:where([class~="not-prose"] *)) {
    font-size: 0.875em;
    line-height: 1.7142857;
  }

  .md\:prose-base :where(thead th):not(:where([class~="not-prose"] *)) {
    padding-right: 0.5714286em;
    padding-bottom: 0.5714286em;
    padding-left: 0.5714286em;
  }

  .md\:prose-base :where(thead th:first-child):not(:where([class~="not-prose"] *)) {
    padding-left: 0;
  }

  .md\:prose-base :where(thead th:last-child):not(:where([class~="not-prose"] *)) {
    padding-right: 0;
  }

  .md\:prose-base :where(tbody td, tfoot td):not(:where([class~="not-prose"] *)) {
    padding-top: 0.5714286em;
    padding-right: 0.5714286em;
    padding-bottom: 0.5714286em;
    padding-left: 0.5714286em;
  }

  .md\:prose-base :where(tbody td:first-child, tfoot td:first-child):not(:where([class~="not-prose"] *)) {
    padding-left: 0;
  }

  .md\:prose-base :where(tbody td:last-child, tfoot td:last-child):not(:where([class~="not-prose"] *)) {
    padding-right: 0;
  }

  .md\:prose-base :where(.md\:prose-base > :first-child):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
  }

  .md\:prose-base :where(.md\:prose-base > :last-child):not(:where([class~="not-prose"] *)) {
    margin-bottom: 0;
  }

  .md\:fixed {
    position: fixed;
  }

  .md\:absolute {
    position: absolute;
  }

  .md\:inset-y-0 {
    top: 0px;
    bottom: 0px;
  }

  .md\:left-0 {
    left: 0px;
  }

  .md\:right-0 {
    right: 0px;
  }

  .md\:order-first {
    order: -9999;
  }

  .md\:ml-0 {
    margin-left: 0px;
  }

  .md\:ml-6 {
    margin-left: 1.5rem;
  }

  .md\:mt-5 {
    margin-top: 1.25rem;
  }

  .md\:mt-8 {
    margin-top: 2rem;
  }

  .md\:flex {
    display: flex;
  }

  .md\:hidden {
    display: none;
  }

  .md\:w-64 {
    width: 16rem;
  }

  .md\:w-auto {
    width: auto;
  }

  .md\:w-96 {
    width: 24rem;
  }

  .md\:max-w-3xl {
    max-width: 48rem;
  }

  .md\:flex-1 {
    flex: 1 1 0%;
  }

  .md\:-translate-y-1\/2 {
    --tw-translate-y: -50%;
    -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
            transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .md\:flex-col {
    flex-direction: column;
  }

  .md\:items-center {
    align-items: center;
  }

  .md\:justify-end {
    justify-content: flex-end;
  }

  .md\:justify-center {
    justify-content: center;
  }

  .md\:space-x-10 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(2.5rem * var(--tw-space-x-reverse));
    margin-left: calc(2.5rem * calc(1 - var(--tw-space-x-reverse)));
  }

  .md\:rounded-lg {
    border-radius: 0.5rem;
  }

  .md\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .md\:py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .md\:px-10 {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .md\:px-0 {
    padding-left: 0px;
    padding-right: 0px;
  }

  .md\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .md\:pl-64 {
    padding-left: 16rem;
  }

  .md\:text-6xl {
    font-size: 3.75rem;
    line-height: 1;
  }

  .md\:text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .md\:text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .lg\:-mx-8 {
    margin-left: -2rem;
    margin-right: -2rem;
  }

  .lg\:mt-0 {
    margin-top: 0px;
  }

  .lg\:ml-4 {
    margin-left: 1rem;
  }

  .lg\:flex {
    display: flex;
  }

  .lg\:hidden {
    display: none;
  }

  .lg\:flex-shrink-0 {
    flex-shrink: 0;
  }

  .lg\:translate-x-1\/2 {
    --tw-translate-x: 50%;
    -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
            transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .lg\:-translate-x-1\/2 {
    --tw-translate-x: -50%;
    -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
            transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .lg\:items-center {
    align-items: center;
  }

  .lg\:justify-between {
    justify-content: space-between;
  }

  .lg\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .lg\:px-5 {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
}

@media (min-width: 1280px) {
  .xl\:inline {
    display: inline;
  }

  .xl\:px-0 {
    padding-left: 0px;
    padding-right: 0px;
  }

  .xl\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1536px) {
  .\32xl\:px-14 {
    padding-left: 3.5rem;
    padding-right: 3.5rem;
  }
}
