import { Plugin, Server } from "@hapi/hapi";
import { CollaborationsService } from "../../services/postgres/CollaborationsService";
import { NotesService } from "../../services/postgres/NotesService";
import { CollaborationsHandler } from "./handler";
import { routes } from "./routes";

export const collaborations: Plugin<{
  server: Server, 
  collaborationsService: CollaborationsService,
  notesService: NotesService,
  validator: Validator
}> = {
  name: "collaborations",
  version: "1.0.0",
  register: async (server, { collaborationsService, notesService, validator }) => {
    console.log("Collaborations plugin");
    const handler = new CollaborationsHandler(collaborationsService, notesService, validator);
    server.route(routes(handler));
  }
}