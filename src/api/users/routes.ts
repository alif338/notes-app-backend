import { UsersHandler } from "./handler";
import Hapi from '@hapi/hapi';

export const routes: ((handler: UsersHandler) => Hapi.ServerRoute[]) = (handler: UsersHandler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersByUsernameHandler
  }
]