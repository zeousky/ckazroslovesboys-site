const form = document.querySelector('#sightings');
const boxes = Array.from(form.querySelectorAll('input[type="checkbox"]'));
const storageKey = 'park-bird-book-sightings';

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) {
    for (const box of boxes) box.checked = saved.includes(box.name);
  }
} catch {
  // The checklist still works for this visit with storage turned off.
}

form.addEventListener('change', () => {
  const seen = boxes.filter(box => box.checked).map(box => box.name);
  try {
    localStorage.setItem(storageKey, JSON.stringify(seen));
  } catch {
    // Storage may be blocked by the browser.
  }
});

const printButton = document.querySelector('#print');
printButton.hidden = false;
printButton.addEventListener('click', () => window.print());
