import { InvariantError } from "../../exceptions/InvariantError";
import { UserPayloadSchema } from "./schema";

export const usersValidator: Validator = {
  validatePayload: (payload: any): any => {
    const { error } = UserPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  }
}