import { InvariantError } from "../../exceptions/InvariantError";
import { CollaborationPayloadSchema } from "./schema";

export const CollaborationsValidator: Validator = {
  validatePayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}