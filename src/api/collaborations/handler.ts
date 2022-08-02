import { ClientError } from "../../exceptions/ClientError";
import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { CollaborationsService } from "../../services/postgres/CollaborationsService";
import { NotesService } from "../../services/postgres/NotesService";

export class CollaborationsHandler {
  private _validator: Validator;
  private _notesService: NotesService;
  private _collaborationsService: CollaborationsService;

  constructor(
    collaborationsService: CollaborationsService,
    notesService: NotesService, 
    validator: Validator,
  ) {
    this._validator = validator;
    this._notesService = notesService;
    this._collaborationsService = collaborationsService;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      this._validator.validatePayload(request.payload);
      const credentialId: any = request.auth.credentials.id;
      const data: Collab = JSON.parse(JSON.stringify(request.payload));

      // Verifikasi ownership sebelum penambahan kolaborasi
      await this._notesService.verifyNoteOwner(data.noteId, credentialId);
      const collaborationId = await this._collaborationsService.addCollaboration(data.noteId, data.userId);
      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        }
      })
      response.code(201);
      return response;
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

  async deleteCollaborationHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    try {
      this._validator.validatePayload(request.payload);
      const credentialId: any = request.auth.credentials.id;
      const data: Collab = JSON.parse(JSON.stringify(request.payload));

      // Verifikasi ownership sebelum penambahan kolaborasi
      await this._notesService.verifyNoteOwner(data.noteId, credentialId);
      await this._collaborationsService.deleteCollaboration(data.noteId, data.userId);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      })
      response.code(200);
      return response;
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