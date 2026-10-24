import { parseNotes, unseen } from '#whatsnew';
import { textParts } from '#onboarding';
import { intlTag } from '#i18n';
import { loadSeen, saveSeen } from '#storage';
import { bindSheetDrag } from '#ds/sheet';
import { $, el, storage, ui, t, lang } from '#ui/context';

// The release notes of the language of the screen, or of English when that file cannot be read
// (VER-19). An empty list when neither can.
const loadNotes = async () => {
  for (const code of new Set([lang, 'en'])) {
    try {
      const response = await fetch(`./release-notes/${code}.md`);
      if (response.ok) return parseNotes(await response.text());
    } catch {
      // The next language, or no notes.
    }
  }
  return [];
};

// A note with its `name` spans, as the onboarding text shows them.
const noteItem = (note) =>
  el('li', {}, textParts(note).map(({ text, key }) => (key ? el('span', { className: 'onboarding-key' }, [text]) : text)));

const entryNode = ({ version, date, notes }) => {
  const day = new Date(`${date}T12:00:00`).toLocaleDateString(intlTag(lang), { day: 'numeric', month: 'long', year: 'numeric' });
  return el('section', { className: 'whatsnew-entry' }, [
    el('h3', { className: 'whatsnew-version', textContent: t('whatsNew.version', { version, date: day }) }),
    el('ul', { className: 'whatsnew-notes' }, notes.map(noteItem)),
  ]);
};

// What to do when the sheet closes: store the seen version after the notes of a start.
let onClose = null;

export const openWhatsNew = (entries, { done = null } = {}) => {
  onClose = done;
  $('whatsnew-body').replaceChildren(...entries.map(entryNode));
  $('whatsnew-sheet').hidden = false;
  $('whatsnew-close').focus();
};

export const isWhatsNewOpen = () => !$('whatsnew-sheet').hidden;

export const closeWhatsNew = () => {
  $('whatsnew-sheet').hidden = true;
  onClose?.();
  onClose = null;
  if (ui.view === 'settings') $('show-whatsnew').focus();
};

// At a start: the notes of the versions after the seen one, once (VER-21). A first start, or a
// storage that cannot be read, shows nothing; the walkthrough is the text of a first start.
export const startWhatsNew = async (running) => {
  const entries = await loadNotes();
  $('show-whatsnew').hidden = entries.length === 0;
  if (!storage || !running) return;
  const seen = loadSeen(storage);
  const save = () => saveSeen(storage, running.version);
  if (seen === null) {
    save();
    return;
  }
  const fresh = unseen(entries, seen);
  if (fresh.length === 0) {
    save();
    return;
  }
  // The walkthrough is open: the notes wait for the next start.
  if (ui.onboarding !== null) return;
  openWhatsNew(fresh, { done: save });
};

export const bind = () => {
  $('whatsnew-veil').addEventListener('click', closeWhatsNew);
  $('whatsnew-close').addEventListener('click', closeWhatsNew);
  bindSheetDrag($('whatsnew-sheet'), { close: closeWhatsNew });
  $('show-whatsnew').addEventListener('click', async () => openWhatsNew(await loadNotes()));
};
