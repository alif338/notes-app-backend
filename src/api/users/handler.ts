import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { ClientError } from "../../exceptions/ClientError";
import { UsersService } from "../../services/postgres/UsersService";

export class UsersHandler {
  private _service: UsersService
  private _validator: Validator
  constructor(service: UsersService, validator: Validator) {
    this._service = service
    this._validator = validator

    this.postUserHandler = this.postUserHandler.bind(this)
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this)
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this)
  }

  async postUserHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      this._validator.validatePayload(request.payload)
      const userId = await this._service.addUser(JSON.parse(JSON.stringify(request.payload)))
      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      })

      response.code(201)
      return response
    } catch(error) {
      if (error instanceof ClientError) {
        console.error(error)
        const response = h.response({
          status: 'error',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getUserByIdHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const { id } = request.params
      const user = await this._service.getUserById(id)
      const response = h.response({
        status: 'success',
        data: {
          user,
        }
      })
      response.code(200)
      return response
    } catch(error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'error',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getUsersByUsernameHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const username: string = request.query.username
      const users = await this._service.getUsersByUsername(username)
      const response = h.response({
        status: 'success',
        data: {
          users,
        }
      })
      response.code(200)
      return response
    } catch (error) {
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