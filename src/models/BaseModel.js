import Database from '../config/db.js';

class BaseModel {
    constructor(tableName) {
        if (this.constructor === BaseModel) {
            throw new Error('BaseModel is an abstract class. Cannot instantiate directly.');
        }
        this.tableName = tableName;
    }

    // Abstract methods - must be implemented by child classes
    async get(id) {
        throw new Error('Method get() must be implemented by child class');
    }

    async create(data) {
        throw new Error('Method create() must be implemented by child class');
    }

    async update(id, data) {
        throw new Error('Method update() must be implemented by child class');
    }

    async delete(id) {
        throw new Error('Method delete() must be implemented by child class');
    }

    async find(filters = {}) {
        throw new Error('Method find() must be implemented by child class');
    }

    // Common methods available to all child classes
    async findAll() {
        const db = await Database.getConnection();
        const [rows] = await db.execute(`SELECT * FROM ${this.tableName} ORDER BY id DESC`);
        return rows;
    }

    async findById(id) {
        const db = await Database.getConnection();
        const [rows] = await db.execute(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return rows[0] || null;
    }

    async executeQuery(sql, params = []) {
        const db = await Database.getConnection();
        const [result] = await db.execute(sql, params);
        return result;
    }
}

export default BaseModel;