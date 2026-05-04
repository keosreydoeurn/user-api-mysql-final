import BaseModel from './BaseModel.js';
import Database from '../config/db.js';

class User extends BaseModel {
    constructor() {
        super('users'); // Call parent constructor with table name
    }

    // Implement abstract methods
    async get(id) {
        return await this.findById(id);
    }

    async create(data) {
        const { name } = data;
        const db = await Database.getConnection();
        
        const [result] = await db.execute(
            'INSERT INTO users (name) VALUES (?)',
            [name]
        );
        
        return { id: result.insertId, name, created_at: new Date() };
    }

    async update(id, data) {
        const { name } = data;
        const db = await Database.getConnection();
        
        const [result] = await db.execute(
            'UPDATE users SET name = ? WHERE id = ?',
            [name, id]
        );
        
        if (result.affectedRows === 0) return null;
        return await this.findById(id);
    }

    async delete(id) {
        const db = await Database.getConnection();
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async find(filters = {}) {
        let query = `SELECT * FROM users WHERE 1=1`;
        const params = [];
        
        if (filters.name) {
            query += ` AND name LIKE ?`;
            params.push(`%${filters.name}%`);
        }
        
        query += ` ORDER BY id DESC`;
        
        const db = await Database.getConnection();
        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Static methods for backward compatibility
    static async findAll() {
        const user = new User();
        return await user.findAll();
    }

    static async findById(id) {
        const user = new User();
        return await user.findById(id);
    }

    static async create(data) {
        const user = new User();
        return await user.create(data);
    }

    static async update(id, data) {
        const user = new User();
        return await user.update(id, data);
    }

    static async delete(id) {
        const user = new User();
        return await user.delete(id);
    }

    static async find(filters) {
        const user = new User();
        return await user.find(filters);
    }
}

export default User;