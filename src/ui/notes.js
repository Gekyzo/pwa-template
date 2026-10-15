import { addNote, editNote, deleteNote, findNote } from '#notes';
import { $, el, ui, state, t, apply, render } from '#ui/context';

const openSheet = (id = null) => {
  ui.sheetOpen = true;
  ui.editing = id;
  $('note-sheet-title').textContent = t(id ? 'notes.editTitle' : 'notes.new');
  $('note-text').value = id ? findNote(state, id)?.text ?? '' : '';
  render();
  $('note-text').focus();
};

export const closeNoteSheet = () => {
  ui.sheetOpen = false;
  ui.editing = null;
  render();
};

const openNote = (id) => {
  ui.noteId = id;
  render();
};

const row = (note) =>
  el('li', { className: 'item-row' }, [
    el('button', { className: 'item-row-body', type: 'button', textContent: note.text, onclick: () => openNote(note.id) }),
  ]);

export const renderNotes = () => {
  const visible = ui.view === 'notes';
  $('notes').hidden = !visible;
  $('fab').hidden = !visible || ui.sheetOpen;
  $('note-list').replaceChildren(...state.notes.map(row));
  $('notes-empty').hidden = state.notes.length > 0;
  const note = ui.noteId === null ? null : findNote(state, ui.noteId);
  if (!note) ui.noteId = null;
  // The pane shows the detail alone below 840px, and beside the list from 840px (LAY-3).
  if (note) $('notes').dataset.detail = '';
  else delete $('notes').dataset.detail;
  $('note-detail-text').textContent = note?.text ?? '';
  $('note-detail-empty').hidden = Boolean(note);
  $('note-actions').hidden = !note;
  $('note-sheet').hidden = !ui.sheetOpen;
};

export const bind = () => {
  $('fab').addEventListener('click', () => openSheet());
  $('note-veil').addEventListener('click', closeNoteSheet);
  $('note-back').addEventListener('click', () => openNote(null));
  $('note-edit').addEventListener('click', () => openSheet(ui.noteId));
  $('note-delete').addEventListener('click', () => {
    const id = ui.noteId;
    ui.noteId = null;
    apply(deleteNote(state, id), { undoText: t('toast.noteDeleted') });
  });
  $('note-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = $('note-text').value;
    const result = ui.editing ? editNote(state, ui.editing, text) : addNote(state, text);
    if (apply(result)) closeNoteSheet();
  });
};
