import { v4 as uuidv4 } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { IResumeRepository } from '../../domain/interfaces/IResumeRepository';
import { Resume, Education, Experience, Skill } from '../../domain/entities/Resume';
import { ResumeEntity } from '../entities/ResumeEntity';
import { EducationEntity } from '../entities/EducationEntity';
import { ExperienceEntity } from '../entities/ExperienceEntity';
import { SkillEntity } from '../entities/SkillEntity';
import { ProjectEntity } from '../entities/ProjectEntity';
import { ProjectTechnologyEntity } from '../entities/ProjectTechnologyEntity';
import { LanguageEntity } from '../entities/LanguageEntity';

export class TypeORMResumeRepository implements IResumeRepository {
  private resumeRepository: Repository<ResumeEntity>;
  private educationRepository: Repository<EducationEntity>;
  private experienceRepository: Repository<ExperienceEntity>;
  private skillRepository: Repository<SkillEntity>;
  private projectRepository: Repository<ProjectEntity>;
  private projectTechnologyRepository: Repository<ProjectTechnologyEntity>;
  private languageRepository: Repository<LanguageEntity>;

  constructor(private dataSource: DataSource) {
    this.resumeRepository = dataSource.getRepository(ResumeEntity);
    this.educationRepository = dataSource.getRepository(EducationEntity);
    this.experienceRepository = dataSource.getRepository(ExperienceEntity);
    this.skillRepository = dataSource.getRepository(SkillEntity);
    this.projectRepository = dataSource.getRepository(ProjectEntity);
    this.projectTechnologyRepository = dataSource.getRepository(ProjectTechnologyEntity);
    this.languageRepository = dataSource.getRepository(LanguageEntity);
  }

  async findById(id: number): Promise<Resume | null> {
    const resumeEntity = await this.resumeRepository.findOne({
      where: { id },
      relations: [
        'education',
        'experience',
        'skills',
        'projects',
        'projects.technologies',
        'languages'
      ]
    });

    if (!resumeEntity) {
      return null;
    }

    return this.mapEntityToDomain(resumeEntity);
  }

  async findByUserId(userId: number): Promise<Resume[]> {
    const resumeEntities = await this.resumeRepository.find({
      where: { userId },
      relations: [
        'education',
        'experience',
        'skills',
        'projects',
        'projects.technologies',
        'languages'
      ]
    });

    return resumeEntities.map(entity => this.mapEntityToDomain(entity));
  }

  async create(resume: Resume): Promise<void> {
    // Start a transaction
    await this.dataSource.transaction(async transactionalEntityManager => {
      // Create resume entity
      const resumeEntity = new ResumeEntity();
      // Only set ID if it's provided (for manual ID assignment)
      if (resume.getId()) {
        resumeEntity.id = resume.getId();
      }
      resumeEntity.userId = resume.getUserId();
      resumeEntity.title = resume.getTitle();
      resumeEntity.summary = resume.getSummary() || '';
      resumeEntity.status = resume.getStatus();
      resumeEntity.contactInformation = resume.getContactInformation() || { email: '' };
      resumeEntity.templateId = resume.getTemplateId() || 0;

      await transactionalEntityManager.save(resumeEntity);

      // Save education
      const education = resume.getEducation();
      if (education.length > 0) {
        const educationEntities = education.map(edu => {
          const entity = new EducationEntity();
          // Only set ID if it's provided (for existing records)
          if (edu.id) {
            entity.id = edu.id;
          }
          entity.resumeId = resumeEntity.id; // Use the saved entity ID which may be auto-generated
          entity.institution = edu.institution;
          entity.degree = edu.degree;
          entity.fieldOfStudy = edu.fieldOfStudy;
          entity.startDate = edu.startDate || new Date();
          entity.endDate = edu.endDate || new Date();
          entity.description = edu.description || '';
          return entity;
        });
        await transactionalEntityManager.save(educationEntities);
      }

      // Save experience
      const experience = resume.getExperience();
      if (experience.length > 0) {
        const experienceEntities = experience.map(exp => {
          const entity = new ExperienceEntity();
          // Only set ID if it's provided (for existing records)
          if (exp.id) {
            entity.id = exp.id;
          }
          entity.resumeId = resumeEntity.id; // Use the saved entity ID which may be auto-generated
          entity.company = exp.company;
          entity.position = exp.position;
          entity.location = exp.location || '';
          entity.startDate = exp.startDate || new Date();
          entity.endDate = exp.endDate || new Date();
          entity.description = exp.description || '';
          entity.achievements = exp.achievements || [];
          return entity;
        });
        await transactionalEntityManager.save(experienceEntities);
      }

      // Save skills
      const skills = resume.getSkills();
      if (skills.length > 0) {
        const skillEntities = skills.map(skill => {
          const entity = new SkillEntity();
          // Only set ID if it's provided (for existing records)
          if (skill.id) {
            entity.id = skill.id;
          }
          entity.resumeId = resumeEntity.id; // Use the saved entity ID which may be auto-generated
          entity.name = skill.name;
          entity.level = skill.level || 0;
          entity.category = skill.category || '';
          return entity;
        });
        await transactionalEntityManager.save(skillEntities);
      }

      // Save projects
      const projects = resume.getProjects();
      if (projects && projects.length > 0) {
        for (const project of projects) {
          const projectEntity = new ProjectEntity();
          // Only set ID if it's provided (for existing records)
          if (project.id) {
            projectEntity.id = project.id.toString();
          }
          projectEntity.resumeId = resumeEntity.id.toString(); // Use the saved entity ID which may be auto-generated
          projectEntity.name = project.name;
          projectEntity.description = project.description || '';
          projectEntity.url = project.url || '';

          await transactionalEntityManager.save(projectEntity);

          // Save technologies for the project
          if (project.technologies && project.technologies.length > 0) {
            const techEntities = project.technologies.map(tech => {
              const entity = new ProjectTechnologyEntity();
              // Auto-generated ID for project technologies
              entity.projectId = projectEntity.id; // Use the saved project ID which may be auto-generated
              entity.technology = tech;
              return entity;
            });
            await transactionalEntityManager.save(techEntities);
          }
        }
      }

      // Save languages
      const languages = resume.getLanguages();
      if (languages && languages.length > 0) {
        const languageEntities = languages.map(lang => {
          const entity = new LanguageEntity();
          // Only set ID if it's provided (for existing records)
          if (lang.id) {
            entity.id = lang.id.toString();
          }
          entity.resumeId = resumeEntity.id.toString(); // Use the saved entity ID which may be auto-generated
          entity.name = lang.name;
          entity.proficiency = lang.proficiency;
          return entity;
        });
        await transactionalEntityManager.save(languageEntities);
      }
    });
  }

  async update(resume: Resume): Promise<void> {
    // First check if resume exists
    const existingResume = await this.resumeRepository.findOne({
      where: { id: resume.getId() }
    });

    if (!existingResume) {
      throw new Error(`Resume with ID ${resume.getId()} not found`);
    }

    // Start transaction for update
    await this.dataSource.transaction(async transactionalEntityManager => {
      // Update resume
      existingResume.title = resume.getTitle();
      existingResume.summary = resume.getSummary() || '';
      existingResume.status = resume.getStatus();
      existingResume.contactInformation = resume.getContactInformation() || { email: '' };
      existingResume.templateId = resume.getTemplateId() || 0;

      await transactionalEntityManager.save(existingResume);

      // Delete existing related entities
      await transactionalEntityManager.delete(EducationEntity, { resumeId: resume.getId() });
      await transactionalEntityManager.delete(ExperienceEntity, { resumeId: resume.getId() });
      await transactionalEntityManager.delete(SkillEntity, { resumeId: resume.getId() });
      await transactionalEntityManager.delete(LanguageEntity, { resumeId: resume.getId() });

      // Get all projects IDs to delete technologies
      const projectEntities = await transactionalEntityManager.find(ProjectEntity, {
        where: { resumeId: resume.getId().toString() },
        select: ['id']
      });
      const projectIds = projectEntities.map(p => p.id);

      // Delete project technologies
      if (projectIds.length > 0) {
        await transactionalEntityManager.delete(ProjectTechnologyEntity, {
          projectId: projectIds
        });
      }

      // Delete projects
      await transactionalEntityManager.delete(ProjectEntity, { resumeId: resume.getId() });

      // Re-create education
      const education = resume.getEducation();
      if (education.length > 0) {
        const educationEntities = education.map(edu => {
          const entity = new EducationEntity();
          // Only set ID if it's provided (for existing records)
          if (edu.id) {
            entity.id = edu.id;
          }
          entity.resumeId = resume.getId();
          entity.institution = edu.institution;
          entity.degree = edu.degree;
          entity.fieldOfStudy = edu.fieldOfStudy;
          entity.startDate = edu.startDate || new Date();
          entity.endDate = edu.endDate || new Date();
          entity.description = edu.description || '';
          return entity;
        });
        await transactionalEntityManager.save(educationEntities);
      }

      // Re-create experience
      const experience = resume.getExperience();
      if (experience.length > 0) {
        const experienceEntities = experience.map(exp => {
          const entity = new ExperienceEntity();
          // Only set ID if it's provided (for existing records)
          if (exp.id) {
            entity.id = exp.id;
          }
          entity.resumeId = resume.getId();
          entity.company = exp.company;
          entity.position = exp.position;
          entity.location = exp.location || '';
          entity.startDate = exp.startDate || new Date();
          entity.endDate = exp.endDate || new Date();
          entity.description = exp.description || '';
          entity.achievements = exp.achievements || [];
          return entity;
        });
        await transactionalEntityManager.save(experienceEntities);
      }

      // Re-create skills
      const skills = resume.getSkills();
      if (skills.length > 0) {
        const skillEntities = skills.map(skill => {
          const entity = new SkillEntity();
          // Only set ID if it's provided (for existing records)
          if (skill.id) {
            entity.id = skill.id;
          }
          entity.resumeId = resume.getId();
          entity.name = skill.name;
          entity.level = skill.level || 0;
          entity.category = skill.category || '';
          return entity;
        });
        await transactionalEntityManager.save(skillEntities);
      }

      // Re-create projects
      const projects = resume.getProjects();
      if (projects && projects.length > 0) {
        for (const project of projects) {
          const projectEntity = new ProjectEntity();
          // Only set ID if it's provided (for existing records)
          if (project.id) {
            projectEntity.id = project.id.toString();
          }
          projectEntity.resumeId = resume.getId().toString();
          projectEntity.name = project.name;
          projectEntity.description = project.description || '';
          projectEntity.url = project.url || '';

          await transactionalEntityManager.save(projectEntity);

          // Re-create technologies for the project
          if (project.technologies && project.technologies.length > 0) {
            const techEntities = project.technologies.map(tech => {
              const entity = new ProjectTechnologyEntity();
              entity.projectId = projectEntity.id;
              entity.technology = tech;
              return entity;
            });
            await transactionalEntityManager.save(techEntities);
          }
        }
      }

      // Re-create languages
      const languages = resume.getLanguages();
      if (languages && languages.length > 0) {
        const languageEntities = languages.map(lang => {
          const entity = new LanguageEntity();
          // Only set ID if it's provided (for existing records)
          if (lang.id) {
            entity.id = lang.id.toString();
          }
          entity.resumeId = resume.getId().toString();
          entity.name = lang.name;
          entity.proficiency = lang.proficiency;
          return entity;
        });
        await transactionalEntityManager.save(languageEntities);
      }
    });
  }

  async delete(id: number): Promise<void> {
    // With cascading deletes configured in entities, deleting the resume
    // will automatically delete all related entities
    await this.resumeRepository.delete(id);
  }

  private mapEntityToDomain(entity: ResumeEntity): Resume {
    // Map education entities to domain objects
    const education: Education[] = entity.education?.map(edu => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description
    })) || [];

    // Map experience entities to domain objects
    const experience: Experience[] = entity.experience?.map(exp => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      achievements: exp.achievements
    })) || [];

    // Map skill entities to domain objects
    const skills: Skill[] = entity.skills?.map(skill => ({
      id: skill.id,
      name: skill.name,
      level: skill.level,
      category: skill.category
    })) || [];
    
    // Create a new domain resume object
    return Resume.create({
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      summary: entity.summary || undefined,
      status: entity.status,
      contactInformation: entity.contactInformation,
      education,
      experience,
      skills,
      projects: entity.projects?.map(project => ({
        id: parseInt(project.id),
        name: project.name,
        description: project.description,
        url: project.url,
        technologies: project.technologies?.map(tech => tech.technology) || []
      })),
      languages: entity.languages?.map(lang => ({
        id: parseInt(lang.id),
        name: lang.name,
        proficiency: lang.proficiency
      })),
      templateId: entity.templateId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }
} 