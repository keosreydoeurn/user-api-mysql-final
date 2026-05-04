import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  static connection = null;

  static async getConnection() {
    if (!this.connection) {
      try {
        const database = process.env.DB_NAME || 'myapp';

        this.connection = await mysql.createConnection({
          host: process.env.DB_HOST || '127.0.0.1',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          port: Number(process.env.DB_PORT) || 3306
        });

        await this.connection.execute(`CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(database)}`);
        await this.connection.changeUser({ database });

        console.log('✅ MySQL connected successfully');
      } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        this.connection = null;
        throw error;
      }
    }
    return this.connection;
  }

  static async initialize() {
    const connection = await this.getConnection();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        qty INT DEFAULT 0,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await this.ensureProductQtyColumn(connection);

    console.log('✅ MySQL tables ready');
  }

  static async ensureProductQtyColumn(connection) {
    const [qtyColumns] = await connection.execute(`SHOW COLUMNS FROM products LIKE 'qty'`);
    if (qtyColumns.length > 0) return;

    await connection.execute(`ALTER TABLE products ADD COLUMN qty INT DEFAULT 0 AFTER price`);

    const [stockColumns] = await connection.execute(`SHOW COLUMNS FROM products LIKE 'stock'`);
    if (stockColumns.length > 0) {
      await connection.execute(`UPDATE products SET qty = stock WHERE qty = 0`);
    }
  }
}

export default Database;
