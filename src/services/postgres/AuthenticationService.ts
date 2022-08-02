import { Pool } from "pg";
import { InvariantError } from "../../exceptions/InvariantError";

export class AuthenticationsService {
  private _pool: Pool;
  constructor() {
    this._pool = new Pool();

    this.addRefreshToken = this.addRefreshToken.bind(this)
    this.verifyRefreshToken = this.verifyRefreshToken.bind(this)
    this.deleteRefreshToken = this.deleteRefreshToken.bind(this)
  }

  async addRefreshToken(token: String): Promise<void> {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    }
    await this._pool.query(query);
  }

  async verifyRefreshToken(token: String): Promise<void> {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    }
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token: String): Promise<void> {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    }
    await this._pool.query(query);
  }
}