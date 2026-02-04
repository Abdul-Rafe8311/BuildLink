# BuildQuote Pro - UI Testing Checklist

## Dark Mode Tests

### Home Page
- [ ] Hero section displays correctly
- [ ] Stats cards are visible and animated
- [ ] CTA buttons have proper hover states
- [ ] Testimonials slider works
- [ ] Featured builders cards display
- [ ] Cost estimator widget is visible and interactive
- [ ] All text is readable
- [ ] Gradients render correctly

### Navigation
- [ ] Navbar is visible at top
- [ ] Logo is visible
- [ ] Nav links are clickable
- [ ] Theme toggle works (switches to light mode)
- [ ] Notification bell is visible
- [ ] Notification dropdown opens on click
- [ ] Mobile menu works (if applicable)

### Gallery Page
- [ ] Filter buttons work
- [ ] Gallery grid displays images
- [ ] Image hover effects work
- [ ] Lightbox opens on image click
- [ ] Lightbox navigation works
- [ ] Close button works

### About Page
- [ ] Stats display correctly (all zeros)
- [ ] Timeline is visible
- [ ] Team cards display
- [ ] Values section renders
- [ ] All text is readable

### Contact Page
- [ ] Contact form displays
- [ ] Input fields are visible
- [ ] Company info is readable
- [ ] Social links are visible
- [ ] FAQ section works

### Interactive Features
- [ ] Search modal opens with Cmd+K
- [ ] Search input is functional
- [ ] Search results display
- [ ] ESC closes search modal
- [ ] Chatbot button is visible
- [ ] Chatbot opens on click
- [ ] Chatbot messages display
- [ ] Currency selector works in chatbot

### Forms & Inputs
- [ ] All input fields are visible
- [ ] Placeholder text is readable
- [ ] Focus states work
- [ ] Error states display correctly
- [ ] Submit buttons work

---

## Light Mode Tests

### Home Page
- [ ] Background color is light
- [ ] Hero text is dark and readable
- [ ] Stats cards have light backgrounds
- [ ] Buttons are visible
- [ ] Testimonials are readable
- [ ] Cost estimator is visible
- [ ] No white-on-white text

### Navigation
- [ ] Navbar has light background
- [ ] Nav links are dark
- [ ] Theme toggle shows moon icon
- [ ] Notification bell is visible
- [ ] Dropdown has light background

### Gallery Page
- [ ] Filter buttons have light backgrounds
- [ ] Images are visible
- [ ] Lightbox has light background
- [ ] Text is dark and readable

### About Page
- [ ] Stats cards have light backgrounds
- [ ] Timeline is visible
- [ ] Team cards are readable
- [ ] All text has proper contrast

### Contact Page
- [ ] Form has light background
- [ ] Input fields are visible
- [ ] Text is dark
- [ ] Social links are visible

### Interactive Features
- [ ] Search modal has light background
- [ ] Search input is visible
- [ ] Chatbot has light theme
- [ ] Chat messages are readable
- [ ] Currency selector is visible

### Color Contrast
- [ ] All headings are readable
- [ ] Body text has sufficient contrast
- [ ] Links are distinguishable
- [ ] Buttons have clear text
- [ ] No accessibility warnings

---

## Responsive Tests

### Mobile (375px)
- [ ] Navbar collapses properly
- [ ] Hero section stacks vertically
- [ ] Stats grid adjusts
- [ ] Forms are usable
- [ ] Buttons are tappable
- [ ] Chatbot fits screen
- [ ] Search modal fits screen

### Tablet (768px)
- [ ] Layout adjusts properly
- [ ] Grid columns reduce
- [ ] Navigation works
- [ ] All features accessible

### Desktop (1920px)
- [ ] Content is centered
- [ ] Max-width containers work
- [ ] No excessive whitespace
- [ ] Images scale properly

---

## Functionality Tests

### Theme Toggle
- [ ] Switches from dark to light
- [ ] Switches from light to dark
- [ ] Preference is saved
- [ ] Smooth transition
- [ ] All elements update

### Navigation
- [ ] Home link works
- [ ] Gallery link works
- [ ] About link works
- [ ] Contact link works
- [ ] URL updates correctly

### Forms
- [ ] Contact form validates
- [ ] Error messages display
- [ ] Success messages display
- [ ] Form resets after submit

### Search (Cmd+K)
- [ ] Opens with keyboard shortcut
- [ ] Closes with ESC
- [ ] Search input works
- [ ] Results filter correctly
- [ ] Clicking result navigates

### Notifications
- [ ] Bell shows badge count
- [ ] Dropdown opens
- [ ] Notifications are readable
- [ ] Mark as read works
- [ ] Clear all works

### Cost Estimator
- [ ] Sliders move smoothly
- [ ] Values update in real-time
- [ ] Currency selector works
- [ ] Calculation is correct
- [ ] Result displays properly

### Chatbot
- [ ] Opens on button click
- [ ] Closes on X button
- [ ] Messages send
- [ ] Bot responds
- [ ] Currency selector works
- [ ] Scroll works in chat

---

## Console & Errors

### JavaScript
- [ ] No console errors on load
- [ ] No errors when navigating
- [ ] No errors when toggling theme
- [ ] No errors in chatbot
- [ ] No errors in search

### CSS
- [ ] No broken styles
- [ ] All animations work
- [ ] Transitions are smooth
- [ ] No layout shifts

---

## Browser Compatibility

### Chrome
- [ ] All features work
- [ ] Styles render correctly
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Styles render correctly
- [ ] No console errors

### Safari
- [ ] All features work
- [ ] Styles render correctly
- [ ] No console errors

---

## Performance

- [ ] Page loads quickly
- [ ] Animations are smooth (60fps)
- [ ] No lag when scrolling
- [ ] Theme toggle is instant
- [ ] Images load efficiently

---

## Accessibility

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] No flashing content

---

## Notes

Use this section to document any issues found:

**Issues Found:**
1. 
2. 
3. 

**Browser-Specific Issues:**
- Chrome: 
- Firefox: 
- Safari: 

**Mobile Issues:**
- 

**Accessibility Issues:**
- 
