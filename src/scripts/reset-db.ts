import 'reflect-metadata';
import { AppDataSource } from '../config/database';

async function resetDatabase() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connected');
    
    console.log('Dropping tables...');
    
    // Disable foreign key checks
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Drop tables
    try { await AppDataSource.query('DROP TABLE IF EXISTS languages'); } catch (e) { console.log(e); }
    try { await AppDataSource.query('DROP TABLE IF EXISTS project_technologies'); } catch (e) { console.log(e); }
    try { await AppDataSource.query('DROP TABLE IF EXISTS projects'); } catch (e) { console.log(e); }
    try { await AppDataSource.query('DROP TABLE IF EXISTS skills'); } catch (e) { console.log(e); }
    try { await AppDataSource.query('DROP TABLE IF EXISTS experience'); } catch (e) { console.log(e); }
    try { await AppDataSource.query('DROP TABLE IF EXISTS education'); } catch (e) { console.log(e); }
    try { await AppDataSource.query('DROP TABLE IF EXISTS resumes'); } catch (e) { console.log(e); }
    try { await AppDataSource.query('DROP TABLE IF EXISTS users'); } catch (e) { console.log(e); }
    try { await AppDataSource.query('DROP TABLE IF EXISTS templates'); } catch (e) { console.log(e); }
    try { await AppDataSource.query('DROP TABLE IF EXISTS migrations'); } catch (e) { console.log(e); }
    
    // Enable foreign key checks
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('All tables dropped successfully');
    
    // Run migrations
    console.log('Running migrations...');
    await AppDataSource.runMigrations();
    console.log('Migrations completed successfully');
    
    console.log('Database reset completed');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

// Run the reset function
resetDatabase(); 