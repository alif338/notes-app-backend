import { InvariantError } from "../../exceptions/InvariantError";
import { DeleteAuthenticationPayloadSchema, PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema } from "./schema";

export class AuthenticationsValidator {
  postAuthenticationValidator: Validator;
  putAuthenticationValidator: Validator;
  deleteAuthenticationValidator: Validator;
  prototype: any;

  constructor() {
    this.postAuthenticationValidator = <Validator>{
      validatePayload: (payload: any): any => {
        const { error } = PostAuthenticationPayloadSchema.validate(payload);
        if (error) {
          throw new InvariantError(error.message);
        }
      }
    };
    this.putAuthenticationValidator = <Validator>{
      validatePayload: (payload: any): any => {
        const { error } = PutAuthenticationPayloadSchema.validate(payload);
        if (error) {
          throw new InvariantError(error.message);
        }
      }
    };
    this.deleteAuthenticationValidator = <Validator>{
      validatePayload: (payload: any): any => {
        const { error } = DeleteAuthenticationPayloadSchema.validate(payload);
        if (error) {
          throw new InvariantError(error.message);
        }
      }
    }
  }
}
// export const AuthenticationsValidator = {
//   postAuthenticationPayload: <Validator>{
//     validatePayload: (payload: any): any => {
//       const { error } = PostAuthenticationPayloadSchema.validate(payload);
//       if (error) {
//         throw new InvariantError(error.message);
//       }
//     }
//   },
//   putAuthenticationPayload: <Validator>{
//     validatePayload: (payload: any): any => {
//       const { error } = PutAuthenticationPayloadSchema.validate(payload);
//       if (error) {
//         throw new InvariantError(error.message);
//       }
//     }
//   },
//   deleteAuthenticationPayload: <Validator>{
//     validatePayload: (payload: any): any => {
//       const { error } = DeleteAuthenticationPayloadSchema.validate(payload);
//       if (error) {
//         throw new InvariantError(error.message);
//       }
//     }
//   }

// }