import BaseModel from './BaseModel.js';
import Database from '../config/db.js';

class Product extends BaseModel {
    constructor() {
        super('products'); // Call parent constructor with table name
    }

    // Implement abstract methods
    async get(id) {
        return await this.findById(id);
    }

    async create(data) {
        const { name, price, qty, description } = data;
        const db = await Database.getConnection();
        
        const [result] = await db.execute(
            'INSERT INTO products (name, price, qty, description) VALUES (?, ?, ?, ?)',
            [name, price, qty || 0, description || '']
        );
        
        return { 
            id: result.insertId, 
            name, 
            price, 
            qty, 
            description,
            created_at: new Date() 
        };
    }

    async update(id, data) {
        const { name, price, qty, description } = data;
        const db = await Database.getConnection();
        
        const [result] = await db.execute(
            'UPDATE products SET name = ?, price = ?, qty = ?, description = ? WHERE id = ?',
            [name, price, qty, description, id]
        );
        
        if (result.affectedRows === 0) return null;
        return await this.findById(id);
    }

    async delete(id) {
        const db = await Database.getConnection();
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async find(filters = {}) {
        let query = `SELECT * FROM products WHERE 1=1`;
        const params = [];
        
        if (filters.name) {
            query += ` AND name LIKE ?`;
            params.push(`%${filters.name}%`);
        }
        
        if (filters.minPrice) {
            query += ` AND price >= ?`;
            params.push(filters.minPrice);
        }
        
        if (filters.maxPrice) {
            query += ` AND price <= ?`;
            params.push(filters.maxPrice);
        }
        
        if (filters.minQty) {
            query += ` AND qty >= ?`;
            params.push(filters.minQty);
        }
        
        if (filters.maxQty) {
            query += ` AND qty <= ?`;
            params.push(filters.maxQty);
        }
        
        if (filters.inStock === 'true') {
            query += ` AND qty > 0`;
        }
        
        if (filters.outOfStock === 'true') {
            query += ` AND qty = 0`;
        }
        
        query += ` ORDER BY id DESC`;
        
        const db = await Database.getConnection();
        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Additional product-specific methods
    async updateQty(id, quantity) {
        const db = await Database.getConnection();
        const [result] = await db.execute(
            'UPDATE products SET qty = qty + ? WHERE id = ?',
            [quantity, id]
        );
        
        if (result.affectedRows === 0) return null;
        return await this.findById(id);
    }

    async getLowStock(threshold = 10) {
        const db = await Database.getConnection();
        const [rows] = await db.execute(
            'SELECT * FROM products WHERE qty <= ? ORDER BY qty ASC',
            [threshold]
        );
        return rows;
    }

    async getOutOfStock() {
        const db = await Database.getConnection();
        const [rows] = await db.execute(
            'SELECT * FROM products WHERE qty = 0 ORDER BY id DESC'
        );
        return rows;
    }

    async getTotalValue() {
        const db = await Database.getConnection();
        const [result] = await db.execute(
            'SELECT SUM(price * qty) as totalValue FROM products'
        );
        return result[0].totalValue || 0;
    }
}

export default Product;