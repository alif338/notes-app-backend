import { NotesHandler } from "./handler";
import { Plugin, Server } from '@hapi/hapi'
import { routes } from "./routes";
import { NotesService } from "../../services/postgres/NotesService";

export const notes: Plugin<{service: NotesService, validator: Validator}> = {
  name: "notes",
  version: "1.0.0",
  register: async (server: Server, { service, validator }) => {
    console.log("notes plugin");
    const handler = new NotesHandler(service, validator);
    server.route(routes(handler));
  }
}