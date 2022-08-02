import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { ClientError } from "../../exceptions/ClientError";
import { NotesService } from "../../services/postgres/NotesService";

export class NotesHandler {
  _service: NotesService;
  _validator: Validator;
  
  constructor(service: NotesService, validator: Validator) {
    this._service = service;
    this._validator = validator;
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByHandler = this.putNoteByHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      this._validator.validatePayload(request.payload);
      console.log('request.payload', request.payload);
      const data: NoteInput = JSON.parse(JSON.stringify(request.payload));
      const cretendidId: any = request.auth.credentials.id;

      const noteId = await this._service.addNote({
        title: data.title,
        body: data.body,
        tags: data.tags,
        owner: cretendidId,
      });

      const response = h.response({
        status: 'success',
        message: `Note with id ${noteId} was added`,
        data: {
          noteId,
        }
      });

      response.code(201);
      return response;
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

  async getNotesHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const credentialId: any = request.auth.credentials.id;
    const notes = await this._service.getNotes(credentialId);
    const response = h.response({
      status: 'success',
      message: 'Notes were retrieved',
      data: notes,
    });
    response.code(200);
    return response;
  }

  async getNoteByIdHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const noteId = request.params.id;
      const credentialId: any = request.auth.credentials.id;
      await this._service.verifyNoteAccess(noteId, credentialId);
      const note = await this._service.getNoteById(noteId);
      const response = h.response({
        status: 'success',
        data: {
          note,
        }
      });
      response.code(200);
      return response;
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

  async putNoteByHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      this._validator.validatePayload(request.payload);
      const noteId = request.params.id;
      const credentialId: any = request.auth.credentials.id;
      await this._service.verifyNoteAccess(noteId, credentialId);

      await this._service.editNoteById(
        noteId, JSON.parse(JSON.stringify(request.payload))
      );

      const response = h.response({
        status: 'success',
        message: `Note with id ${noteId} was edited`,
      });
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

  async deleteNoteByIdHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      const noteId = request.params.id;
      const credentialId: any = request.auth.credentials.id;
      await this._service.verifyNoteOwner(noteId, credentialId);
      await this._service.deleteNoteById(noteId);
      const response = h.response({
        status: 'success',
        message: `Note with id ${noteId} was deleted`,
      });
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
}