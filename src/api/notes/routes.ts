import { NotesHandler } from "./handler";
import Hapi from '@hapi/hapi';

export const routes: ((handler: NotesHandler) => Hapi.ServerRoute[]) = (handler: NotesHandler) => [
  {
    method: 'POST',
    path: '/notes',
    handler: handler.postNoteHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  }, {
    method: 'GET',
    path: '/notes',
    handler: handler.getNotesHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  }, {
    method: 'GET',
    path: '/notes/{id}',
    handler: handler.getNoteByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  }, {
    method: 'PUT',
    path: '/notes/{id}',
    handler: handler.putNoteByHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  }, {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: handler.deleteNoteByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  }
];