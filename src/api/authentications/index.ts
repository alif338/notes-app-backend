import { Plugin, Server } from "@hapi/hapi";
import { AuthenticationsService } from "../../services/postgres/AuthenticationService";
import { UsersService } from "../../services/postgres/UsersService";
import { TokenManager } from "../../tokenize/TokenManager";
import { AuthenticationsValidator } from "../../validator/authentications";
import { AuthenticationsHandler } from "./handler";
import { routes } from "./routes";

export const authentications: Plugin<{
  service: AuthenticationsService, 
  validator: AuthenticationsValidator,
  tokenManager: TokenManager,
  usersService: UsersService
}> = {
  name: "authentications",
  version: "1.0.0",
  register: async (
    server: Server, 
    { service, validator, usersService, tokenManager}) => {
    console.log("Auth plugin");
    const handler = new AuthenticationsHandler(service,  usersService, tokenManager, validator);
    server.route(routes(handler));
  }
}