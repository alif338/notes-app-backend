import { Plugin, Server } from "@hapi/hapi";
import { UsersService } from "../../services/postgres/UsersService";
import { UsersHandler } from "./handler";
import { routes } from "./routes";

export const users: Plugin<{service: UsersService, validator: Validator}> = {
  name: "users",
  version: "1.0.0",
  register: async (server: Server, { service, validator }) => {
    console.log("users plugin");
    const handler = new UsersHandler(service, validator);
    server.route(routes(handler));
  }
}