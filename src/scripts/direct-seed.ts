import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcryptjs from 'bcryptjs';
import { DataSource } from 'typeorm';
import { UserEntity } from '../modules/users/infrastructure/entities/UserEntity';
import { ResumeEntity } from '../modules/resumes/infrastructure/entities/ResumeEntity';
import { EducationEntity } from '../modules/resumes/infrastructure/entities/EducationEntity';
import { ExperienceEntity } from '../modules/resumes/infrastructure/entities/ExperienceEntity';
import { SkillEntity } from '../modules/resumes/infrastructure/entities/SkillEntity';
import { ProjectEntity } from '../modules/resumes/infrastructure/entities/ProjectEntity';
import { ProjectTechnologyEntity } from '../modules/resumes/infrastructure/entities/ProjectTechnologyEntity';
import { LanguageEntity } from '../modules/resumes/infrastructure/entities/LanguageEntity';
import { EUserRole, EAuthProvider } from '../modules/users/domain/entities/User';
import { EResumeStatus } from '../modules/resumes/domain/entities/Resume';

// Load environment variables
dotenv.config();

async function seedData() {
  try {
    // Connect to the database and create tables
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'resume_user',
      password: process.env.DB_PASSWORD || 'resume_password',
      database: process.env.DB_DATABASE || 'resume_builder',
      entities: [
        UserEntity,
        ResumeEntity,
        EducationEntity,
        ExperienceEntity,
        SkillEntity,
        ProjectEntity,
        ProjectTechnologyEntity,
        LanguageEntity
      ],
      dropSchema: true, // Drop all tables before creating them
      synchronize: true, // Create tables based on entities
      logging: true,
    });

    await dataSource.initialize();
    console.log('Database connected and schema synchronized');

    // Create admin user
    const adminUser = new UserEntity();
    adminUser.email = 'admin@example.com';
    adminUser.passwordHash = await bcryptjs.hash('admin123', 10);
    adminUser.firstName = 'Admin';
    adminUser.lastName = 'User';
    adminUser.role = EUserRole.Admin;
    adminUser.authProvider = EAuthProvider.Local;
    adminUser.authProviderUserId = '';
    adminUser.isVerified = true;
    
    const savedAdmin = await dataSource.manager.save(adminUser);
    console.log('Admin user created:', savedAdmin.id);

    // Create regular user
    const regularUser = new UserEntity();
    regularUser.email = 'user@example.com';
    regularUser.passwordHash = await bcryptjs.hash('user123', 10);
    regularUser.firstName = 'Regular';
    regularUser.lastName = 'User';
    regularUser.role = EUserRole.User;
    regularUser.authProvider = EAuthProvider.Local;
    regularUser.authProviderUserId = '';
    regularUser.isVerified = true;

    const savedUser = await dataSource.manager.save(regularUser);
    console.log('Regular user created:', savedUser.id);

    // Create a resume for the regular user
    const resume = new ResumeEntity();
    resume.userId = savedUser.id;
    resume.title = 'Software Developer Resume';
    resume.summary = 'Experienced software developer with 5 years of experience';
    resume.status = EResumeStatus.Published;
    resume.contactInformation = {
      email: 'user@example.com',
      phone: '+1234567890',
      address: '123 Main St, City, Country',
      website: 'www.myportfolio.com',
      linkedin: 'linkedin.com/in/user',
      github: 'github.com/user'
    };

    const savedResume = await dataSource.manager.save(resume);
    console.log('Resume created:', savedResume.id);

    // Add education to the resume
    const education = new EducationEntity();
    education.resumeId = savedResume.id;
    education.institution = 'University of Technology';
    education.degree = 'Bachelor of Science';
    education.fieldOfStudy = 'Computer Science';
    education.startDate = new Date('2014-09-01');
    education.endDate = new Date('2018-06-01');
    education.description = 'Graduated with honors. Specialized in software engineering.';

    const savedEducation = await dataSource.manager.save(education);
    console.log('Education record created:', savedEducation.id);

    // Add experience to the resume
    const experience = new ExperienceEntity();
    experience.resumeId = savedResume.id;
    experience.company = 'Tech Solutions Inc.';
    experience.position = 'Software Developer';
    experience.location = 'San Francisco, CA';
    experience.startDate = new Date('2018-07-01');
    experience.endDate = new Date('2022-03-01');
    experience.description = 'Full-stack software development for web applications';
    experience.achievements = [
      'Improved application performance by 40%',
      'Led team of 3 developers for a client project',
      'Implemented CI/CD pipeline'
    ];

    const savedExperience = await dataSource.manager.save(experience);
    console.log('Experience record created:', savedExperience.id);

    // Add skills to the resume
    const skills = [
      {
        name: 'JavaScript',
        level: 5,
        category: 'Programming'
      },
      {
        name: 'TypeScript',
        level: 4,
        category: 'Programming'
      },
      {
        name: 'React',
        level: 4,
        category: 'Frontend'
      }
    ];

    for (const skillData of skills) {
      const skill = new SkillEntity();
      skill.resumeId = savedResume.id;
      skill.name = skillData.name;
      skill.level = skillData.level;
      skill.category = skillData.category;
      
      const savedSkill = await dataSource.manager.save(skill);
      console.log(`Skill '${skillData.name}' created:`, savedSkill.id);
    }

    console.log('Data seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedData(); 