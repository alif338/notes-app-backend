import { InvariantError } from "../../exceptions/InvariantError";
import { NotePayloadSchema } from "./schema";

export const notesValidator: Validator = {
  validatePayload: (payload: any): any => {
    const { error } = NotePayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  }
}