require('dotenv').config();

const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    /**
     * plugin: {
        name: 'notes',
        version: '1.0.0',
        register: async (server, { service, validator }) => {
          const notesHandler = new NotesHandler(service, validator);
          server.route(routes(notesHandler));
        },
      }
     */
    options: {
      service: notesService,
      validator: NotesValidator
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
