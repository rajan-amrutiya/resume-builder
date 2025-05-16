import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1690000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        auth_provider ENUM('local', 'google', 'github') DEFAULT 'local',
        auth_provider_user_id VARCHAR(255),
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create resumes table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        status ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
        contact_information JSON,
        template_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create education table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS education (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        field_of_study VARCHAR(255),
        start_date DATE,
        end_date DATE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      )
    `);

    // Create experience table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        company VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        start_date DATE,
        end_date DATE,
        description TEXT,
        achievements JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      )
    `);

    // Create skills table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        level INT,
        category VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      )
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      )
    `);

    // Create project_technologies table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS project_technologies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        technology VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    // Create languages table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS languages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        proficiency VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      )
    `);

    // Create templates table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        thumbnail VARCHAR(255),
        preview VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order to avoid foreign key constraints
    await queryRunner.query('DROP TABLE IF EXISTS languages');
    await queryRunner.query('DROP TABLE IF EXISTS project_technologies');
    await queryRunner.query('DROP TABLE IF EXISTS projects');
    await queryRunner.query('DROP TABLE IF EXISTS skills');
    await queryRunner.query('DROP TABLE IF EXISTS experience');
    await queryRunner.query('DROP TABLE IF EXISTS education');
    await queryRunner.query('DROP TABLE IF EXISTS resumes');
    await queryRunner.query('DROP TABLE IF EXISTS users');
    await queryRunner.query('DROP TABLE IF EXISTS templates');
  }
} 