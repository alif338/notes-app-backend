import { AuthenticationsHandler } from "./handler";
import Hapi from '@hapi/hapi';

export const routes: ((handler: AuthenticationsHandler) => Hapi.ServerRoute[]) = (handler:AuthenticationsHandler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler
  }, {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler
  }, {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler
  }
]