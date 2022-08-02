import { nanoid } from "nanoid";
import { Pool } from "pg";
import { InvariantError } from "../../exceptions/InvariantError";
import { NotFoundError } from "../../exceptions/NotFoundError";
import bcrypt from "bcrypt";
import { AuthenticationError } from "../../exceptions/AuthenticationError";

export class UsersService {
  private _pool: Pool;

  constructor() {
    this._pool = new Pool();
    this.verifyUsername = this.verifyUsername.bind(this);
  }

  async verifyUsername(username: string) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError("Gagal menambahkan user. Username sudah digunakan");
    }
  }

  async addUser({ username, password, fullname }: User): Promise<string> {
    await this.verifyUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) returning id',
      values: [id, username, hashedPassword, fullname]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan')
    }
    return result.rows[0].id
  }

  async getUserById(userId: string): Promise<User> {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0]
  }

  async verifyUserCredential(username: string, password: string): Promise<string> {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    const { id, password: hashedPassword } = result.rows[0]
    const match = await bcrypt.compare(password, hashedPassword)
    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return id
  }

  async getUsersByUsername(username: string): Promise<User[]> {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}