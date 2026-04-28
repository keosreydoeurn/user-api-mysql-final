import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  static connection = null;

  static async getConnection() {
    if (!this.connection) {
      try {
        this.connection = await mysql.createConnection({
          host: process.env.DB_HOST || '127.0.0.1',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'myapp',
          port: process.env.DB_PORT || 3307
        });
        console.log('✅ MySQL connected successfully');
      } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        throw error;
      }
    }
    return this.connection;
  }

  static async initialize() {
    const connection = await this.getConnection();
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS myapp`);
    await connection.changeUser({ database: 'myapp' });
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ MySQL users table ready');
  }
}

export default Database;
