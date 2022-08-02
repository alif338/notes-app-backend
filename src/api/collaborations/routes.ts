import { CollaborationsHandler } from "./handler";
import Hapi from '@hapi/hapi';

export const routes: ((handler: CollaborationsHandler) => Hapi.ServerRoute[]) = (handler: CollaborationsHandler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: 'notesapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'notesapp_jwt'
    }
  }
]