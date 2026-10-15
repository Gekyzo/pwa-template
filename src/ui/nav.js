import { slideTo } from '#sections';
import { visibleSections } from '#modules';
import { ui, off, render, scroller } from '#ui/context';
import { checkVersion } from '#ui/update';

export const setView = (view) => {
  if (view === ui.view) return;
  ui.view = view;
  ui.noteId = null;
  if (view === 'settings') checkVersion();
  scroller.scrollTop = 0;
  render();
};

export const renderNav = () => {
  const sections = visibleSections(off);
  // A section of a module that went off sends the view to the first one that is on.
  if (!sections.includes(ui.view)) ui.view = sections[0];
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.hidden = !sections.includes(button.dataset.view);
    if (button.dataset.view === ui.view) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
};

export const bind = () => {
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });
  // A horizontal slide on the content changes the section (NAV-2).
  let start = null;
  scroller.addEventListener('pointerdown', (event) => {
    start = event.isPrimary ? { x: event.clientX, y: event.clientY } : null;
  });
  scroller.addEventListener('pointercancel', () => {
    start = null;
  });
  scroller.addEventListener('pointerup', (event) => {
    if (!start || ui.sheetOpen) return;
    const next = slideTo(ui.view, event.clientX - start.x, event.clientY - start.y, visibleSections(off));
    start = null;
    if (next) setView(next);
  });
};
