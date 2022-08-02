import Jwt from "@hapi/jwt"
import { InvariantError } from "../exceptions/InvariantError"

export class TokenManager {
  constructor() {
    this.generateAccessToken = this.generateAccessToken.bind(this);
    this.generateRefreshToken = this.generateRefreshToken.bind(this);
    this.verifyRefreshToken = this.verifyRefreshToken.bind(this);
  }
  generateAccessToken(payload: any): string {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY || 'abc123');
  }

  generateRefreshToken(payload: any): string {
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY || 'abc123');
  }

  verifyRefreshToken(refreshToken: string): any {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY || 'abc123');
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}

// export const TokenManagers = {
//   generateAccessToken: (payload: any): string => {
//     return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY || 'abc123')
//   },
//   generateRefreshToken: (payload: any): string => {
//     return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY || 'abc123')
//   },
//   verifyRefreshToken: (refreshToken: string): any => {
//     try {
//       const artifacts = Jwt.token.decode(refreshToken)
//       Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY || 'abc123')
//       const { payload } = artifacts.decoded
//       return payload
//     } catch (error) {
//       throw new InvariantError('Refresh token tidak valid')
//     }
//   }
// }