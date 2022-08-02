import { nanoid } from "nanoid";
import { InvariantError } from "../../exceptions/InvariantError";
import { NotFoundError } from "../../exceptions/NotFoundError";

export class NotesService {
  private _notes: Note[];
  constructor() {
    this._notes = [];
  }

  addNote(title: string, body: string, tags: string[]): string {
    const id = nanoid(16);
    const createdAt: string = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote: Note = {
      title, tags, body, id, createdAt, updatedAt
    };

    this._notes.push(newNote);
    const isSuccess: boolean = this._notes.filter(note => note.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError(`Note with id ${id} was not added`);
    }

    return id;
  }

  getNotes(): Note[] {
    return this._notes;
  }

  getNoteById(id: string): Note {
    const note = this._notes.find(note => note.id === id);
    if (!note) {
      throw new NotFoundError(`Note with id ${id} was not found`);
    }
    return note;
  }

  editNoteById(id: string, data: NoteInput): void {
    const index = this._notes.findIndex(note => note.id === id);
    if (index === -1) {
      throw new NotFoundError(`Note with id ${id} was not found`);
    }
    const updatedAt: string = new Date().toISOString();

    this._notes[index] = {
      ...this._notes[index],
      ...data,
      updatedAt
    }
  }

  deleteNoteById(id: string): void {
    const index = this._notes.findIndex(note => note.id === id);
    if (index === -1) {
      throw new NotFoundError(`Note with id ${id} was not found`);
    }
    this._notes.splice(index, 1);
  }
}