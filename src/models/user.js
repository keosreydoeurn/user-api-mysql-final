import Database from '../config/db.js';

class User {
  constructor(id = null, name = null, created_at = null) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
  }

  static async findAll() {
    const db = await Database.getConnection();
    const [rows] = await db.execute('SELECT * FROM users ORDER BY id DESC');
    return rows.map(({ id, name, created_at }) => new User(id, name, created_at));
  }

  static async findById(id) {
    const db = await Database.getConnection();
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    
    if (rows.length === 0) return null;
    
    const { id: userId, name, created_at } = rows[0];
    return new User(userId, name, created_at);
  }

  static async create(userData) {
    const { name } = userData;
    const db = await Database.getConnection();
    
    const [result] = await db.execute(
      'INSERT INTO users (name) VALUES (?)',
      [name]
    );
    
    return new User(result.insertId, name, new Date());
  }

  static async update(id, userData) {
    const { name } = userData;
    const db = await Database.getConnection();
    
    const [result] = await db.execute(
      'UPDATE users SET name = ? WHERE id = ?',
      [name, id]
    );
    
    if (result.affectedRows === 0) return null;
    
    return await User.findById(id);
  }

  static async delete(id) {
    const db = await Database.getConnection();
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default User;
