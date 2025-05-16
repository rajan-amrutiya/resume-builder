import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'SG-Resume-Builder-12570-mysql-master.servers.mongodirector.com',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'sgroot',
  password: process.env.DB_PASSWORD || '44Tt&3rVTX0qIpzg',
  database: process.env.DB_DATABASE || 'resume_builder',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '../modules/**/infrastructure/entities/*.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false // In production, you should use a proper CA certificate
  }
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}; 