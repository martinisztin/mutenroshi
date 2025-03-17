import mysql from 'mysql2/promise';
import config from '../config.json' with {type: 'json'};

export class DB {
    static instance = null;
        
    static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
            DB.instance.connect();
        }
        return DB.instance;
    }
    
    constructor() {
        this.config = {
            host: config.DB_HOST || 'localhost',
            user: config.DB_USER || 'root',
            password: config.DB_PASSWORD || '',
            database: config.DB_NAME,
            port: config.DB_PORT || 3306
        };
        this.db = null;
    }

    async connect() {
        try {
            this.db = mysql.createPool(this.config);
            console.log('Database connection established');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    async query(sql, params = []) {
        try {
            const [results] = await this.db.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    }

    async close() {
        try {
            await this.db.end();
            console.log('Database connection closed');
        } catch (error) {
            console.error('Error closing database:', error);
            throw error;
        }
    }
}