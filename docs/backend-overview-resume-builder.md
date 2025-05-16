# AI Resume Builder Backend Implementation - Detailed Overview

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  provider ENUM('local', 'google', 'github') DEFAULT 'local',
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  template_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Personal Info Table
```sql
CREATE TABLE personal_info (
  id VARCHAR(36) PRIMARY KEY,
  resume_id VARCHAR(36) NOT NULL UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  summary TEXT,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);
```

### Education Table
```sql
CREATE TABLE education (
  id VARCHAR(36) PRIMARY KEY,
  resume_id VARCHAR(36) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255),
  field VARCHAR(255),
  start_date DATE,
  end_date DATE,
  description TEXT,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);
```

### Experience Table
```sql
CREATE TABLE experience (
  id VARCHAR(36) PRIMARY KEY,
  resume_id VARCHAR(36) NOT NULL,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);
```

### Skills Table
```sql
CREATE TABLE skills (
  id VARCHAR(36) PRIMARY KEY,
  resume_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id VARCHAR(36) PRIMARY KEY,
  resume_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  link VARCHAR(255),
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);
```

### Project Technologies Table
```sql
CREATE TABLE project_technologies (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  technology VARCHAR(255) NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Templates Table
```sql
CREATE TABLE templates (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255),
  preview VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## TypeORM Entities

Example TypeORM entity for User to demonstrate implementation pattern:

```typescript
// src/models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Resume } from './Resume';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  name: string;

  @Column({ 
    type: 'enum', 
    enum: ['local', 'google', 'github'], 
    default: 'local' 
  })
  provider: 'local' | 'google' | 'github';

  @Column({ nullable: true })
  provider_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Resume, resume => resume.user)
  resumes: Resume[];
}
```

## API Implementation

### 1. Authentication

#### Register User
- **Endpoint**: `POST /api/auth/signup`
- **Controller**:
```typescript
// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    const userRepository = getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({
        status: false,
        error: {
          message: 'User with this email already exists',
          code: 'EMAIL_EXISTS'
        }
      });
    }
    
    const hashedPassword = await hash(password, 10);
    
    const user = userRepository.create({
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      provider: 'local'
    });
    
    await userRepository.save(user);
    
    // Generate JWT token
    const token = generateToken(user);
    
    return res.status(201).json({
      status: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: {
        message: 'Server error',
        code: 'SERVER_ERROR'
      }
    });
  }
};
```

#### Similar implementations for:
- Login User (`POST /api/auth/signin`)
- Google OAuth (`POST /api/auth/google`)
- GitHub OAuth (`POST /api/auth/github`)
- Sign Out (`POST /api/auth/signout`)
- Get Current User (`GET /api/auth/me`)

### 2. User Management

#### Get User Profile & Update User Profile
- Implementation will access user information from database
- Will be protected by authentication middleware

### 3. Resume Management

#### Create Resume
- **Endpoint**: `POST /api/resumes`
- **Controller**:
```typescript
// src/controllers/resume.controller.ts
import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Resume } from '../models/Resume';
import { PersonalInfo } from '../models/PersonalInfo';
import { Education } from '../models/Education';
import { Experience } from '../models/Experience';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { ProjectTechnology } from '../models/ProjectTechnology';

export const createResume = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { 
      title, 
      personalInfo, 
      education, 
      experience, 
      skills, 
      projects 
    } = req.body;
    
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Create resume
      const resumeRepo = queryRunner.manager.getRepository(Resume);
      const resumeId = uuidv4();
      const resume = resumeRepo.create({
        id: resumeId,
        user_id: userId,
        title
      });
      await queryRunner.manager.save(resume);
      
      // Add personal info
      if (personalInfo) {
        const personalInfoRepo = queryRunner.manager.getRepository(PersonalInfo);
        const personalInfoEntity = personalInfoRepo.create({
          id: uuidv4(),
          resume_id: resumeId,
          ...personalInfo
        });
        await queryRunner.manager.save(personalInfoEntity);
      }
      
      // Add education records
      if (education && education.length > 0) {
        const educationRepo = queryRunner.manager.getRepository(Education);
        const educationEntities = education.map(edu => educationRepo.create({
          id: uuidv4(),
          resume_id: resumeId,
          ...edu
        }));
        await queryRunner.manager.save(educationEntities);
      }
      
      // Add experience records
      if (experience && experience.length > 0) {
        const experienceRepo = queryRunner.manager.getRepository(Experience);
        const experienceEntities = experience.map(exp => experienceRepo.create({
          id: uuidv4(),
          resume_id: resumeId,
          ...exp
        }));
        await queryRunner.manager.save(experienceEntities);
      }
      
      // Add skills
      if (skills && skills.length > 0) {
        const skillRepo = queryRunner.manager.getRepository(Skill);
        const skillEntities = skills.map(skill => skillRepo.create({
          id: uuidv4(),
          resume_id: resumeId,
          name: skill
        }));
        await queryRunner.manager.save(skillEntities);
      }
      
      // Add projects
      if (projects && projects.length > 0) {
        const projectRepo = queryRunner.manager.getRepository(Project);
        const techRepo = queryRunner.manager.getRepository(ProjectTechnology);
        
        for (const proj of projects) {
          const projectId = uuidv4();
          const project = projectRepo.create({
            id: projectId,
            resume_id: resumeId,
            name: proj.name,
            description: proj.description,
            link: proj.link
          });
          await queryRunner.manager.save(project);
          
          // Save technologies for this project
          if (proj.technologies && proj.technologies.length > 0) {
            const techEntities = proj.technologies.map(tech => techRepo.create({
              id: uuidv4(),
              project_id: projectId,
              technology: tech
            }));
            await queryRunner.manager.save(techEntities);
          }
        }
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(201).json({
        status: true,
        data: {
          id: resumeId,
          title,
          createdAt: resume.created_at,
          updatedAt: resume.updated_at
        }
      });
      
    } catch (err) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
    
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: {
        message: 'Failed to create resume',
        code: 'CREATE_RESUME_ERROR'
      }
    });
  }
};
```

#### Similar implementations for:
- Get All Resumes (`GET /api/resumes`)
- Get Resume by ID (`GET /api/resumes/:id`)
- Update Resume (`PUT /api/resumes/:id`)
- Delete Resume (`DELETE /api/resumes/:id`)

### 4. Template Management

#### Get All Templates & Apply Template
- Implementation will retrieve template information
- Apply template will update the resume with the chosen template

## Authentication Middleware

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../models/User';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        }
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      error: {
        message: 'Authentication failed',
        code: 'AUTH_FAILED'
      }
    });
  }
};
```

## Setup and Configuration Files

### TypeORM Configuration
```typescript
// src/config/database.ts
import { ConnectionOptions } from 'typeorm';
import { User } from '../models/User';
import { Resume } from '../models/Resume';
import { PersonalInfo } from '../models/PersonalInfo';
import { Education } from '../models/Education';
import { Experience } from '../models/Experience';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { ProjectTechnology } from '../models/ProjectTechnology';
import { Template } from '../models/Template';

const config: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'resume_builder',
  entities: [
    User,
    Resume,
    PersonalInfo,
    Education,
    Experience,
    Skill,
    Project,
    ProjectTechnology,
    Template
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production'
};

export default config;
```

### Express App Setup
```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import dbConfig from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import resumeRoutes from './routes/resume.routes';
import templateRoutes from './routes/template.routes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/templates', templateRoutes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: false,
    error: {
      message: 'Server error',
      code: 'SERVER_ERROR'
    }
  });
});

// Connect to database and start server
createConnection(dbConfig)
  .then(() => {
    console.log('Connected to database');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });

export default app;
```

## Project Setup Steps

1. **Initialize Project**:
```bash
mkdir resume-builder-backend
cd resume-builder-backend
npm init -y
```

2. **Install Dependencies**:
```bash
# Core dependencies
npm install express cors helmet mysql2 typeorm reflect-metadata jsonwebtoken bcrypt uuid dotenv

# Development dependencies
npm install -D typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcrypt @types/uuid ts-node nodemon
```

3. **TypeScript Configuration**:
```bash
# Create tsconfig.json
npx tsc --init
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "lib": ["es2017", "esnext.asynciterable"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

4. **Environment Configuration**:
Create `.env` file:
```
PORT=3000
JWT_SECRET=your_jwt_secret_key
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=resume_builder
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

5. **Update package.json Scripts**:
```json
"scripts": {
  "start": "node dist/server.js",
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "lint": "eslint . --ext .ts"
}
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/github` - GitHub OAuth login
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/update` - Update user profile

### Resume Management
- `POST /api/resumes` - Create resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get resume by ID
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### Template Management
- `GET /api/templates` - Get all templates
- `POST /api/resumes/:id/apply-template` - Apply template to resume
