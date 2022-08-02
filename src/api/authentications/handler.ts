import { ClientError } from "../../exceptions/ClientError";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { AuthenticationsService } from "../../services/postgres/AuthenticationService";
import { UsersService } from "../../services/postgres/UsersService";
import { TokenManager } from "../../tokenize/TokenManager";
import { AuthenticationsValidator } from "../../validator/authentications";

export class AuthenticationsHandler {
  // TODO: Implement handler
  private _authenticationsService: AuthenticationsService;
  private _validator: AuthenticationsValidator;
  private _usersService: UsersService;
  private _tokenManager: TokenManager;

  constructor(
    authenticationsService: AuthenticationsService,
    usersService: UsersService,
    tokenManager: TokenManager,
    validator: AuthenticationsValidator
  ) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
  }

  async postAuthenticationHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      this._validator.postAuthenticationValidator.validatePayload(request.payload);
      const data: User = JSON.parse(JSON.stringify(request.payload));
      const id = await this._usersService.verifyUserCredential(data.username, data.password);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });
      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken
        }
      });
      response.code(201);
      return response;
    } catch(error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
 
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAuthenticationHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      await this._validator.putAuthenticationValidator.validatePayload(request.payload);
      const token: Token = JSON.parse(JSON.stringify(request.payload));
      console.log(token)
      await this._authenticationsService.verifyRefreshToken(token.refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(token.refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ id: id });
      const response = h.response({
        status: 'success', 
        message: 'Access token berhasil diperbarui',
        data: {
          accessToken
        }
      })
      response.code(200)
      return response
    } catch(error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
 
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAuthenticationHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      this._validator.deleteAuthenticationValidator.validatePayload(request.payload);
      const token: Token = JSON.parse(JSON.stringify(request.payload));
      await this._authenticationsService.verifyRefreshToken(token.refreshToken);
      await this._authenticationsService.deleteRefreshToken(token.refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Refresh token berhasil dihapus'
      })
      response.code(200)
      return response
    } catch(error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
 
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}