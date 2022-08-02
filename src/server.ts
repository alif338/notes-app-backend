'use strict'

require('dotenv').config();
import Hapi, { Request, ResponseToolkit }  from '@hapi/hapi';
import Jwt from '@hapi/jwt'


// Notes
import { notes } from './api/notes';
import { NotesService } from './services/postgres/NotesService';
import { notesValidator } from './validator/notes';

// Users
import { users } from './api/users';
import { UsersService } from './services/postgres/UsersService';
import { usersValidator } from './validator/users';

// Authentication
import { authentications } from './api/authentications';
import { AuthenticationsService } from './services/postgres/AuthenticationService';
import { AuthenticationsValidator } from './validator/authentications';
import { TokenManager } from './tokenize/TokenManager';

// Collaborations
import { collaborations } from './api/collaborations';
import { CollaborationsService } from './services/postgres/CollaborationsService';
import { CollaborationsValidator } from './validator/collaborations';

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService(collaborationsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService()
  const authenticationValidator = new AuthenticationsValidator();
  const tokenManager = new TokenManager()

  const server: Hapi.Server = Hapi.server({
    port: process.env.port || 3000,
    host: process.env.host || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      }
    }
  });

  // Registrasi plugin eksternal
  await server.register([
    Jwt
  ])

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 30 * 30 * 24, // 30 hari
    },
    validate: (artifacts: any) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      }
    })
  })

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: notesValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: usersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        service: authenticationsService,
        usersService: usersService,
        tokenManager: tokenManager,
        validator: authenticationValidator
      }
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService: collaborationsService,
        notesService: notesService,
        validator: CollaborationsValidator
      }
    }
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}

init();