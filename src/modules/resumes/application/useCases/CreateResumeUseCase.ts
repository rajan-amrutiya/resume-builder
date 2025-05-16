import { Resume, EResumeStatus, ResumeProps } from '../../domain/entities/Resume';
import { IResumeRepository } from '../../domain/interfaces/IResumeRepository';

export interface CreateResumeUseCaseInput {
  userId: number;
  title: string;
  personalInfo?: {
    name?: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    achievements?: string[];
  }>;
  skills?: string[];
  projects?: Array<{
    name: string;
    description?: string;
    url?: string;
    technologies?: string[];
  }>;
}

export interface CreateResumeUseCaseOutput {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateResumeUseCase {
  constructor(private resumeRepository: IResumeRepository) {}

  async execute(input: CreateResumeUseCaseInput): Promise<CreateResumeUseCaseOutput> {
    // Prepare resume data
    const resumeData: ResumeProps = {
      userId: input.userId,
      title: input.title,
      status: EResumeStatus.Draft,
      contactInformation: input.personalInfo ? {
        email: input.personalInfo.email,
        phone: input.personalInfo.phone,
        address: input.personalInfo.location,
        website: input.personalInfo.website,
        linkedin: input.personalInfo.linkedin,
        github: input.personalInfo.github
      } : undefined
    };

    // Create resume entity
    const resume = Resume.create(resumeData);
    
    // Add education items
    if (input.education && input.education.length > 0) {
      input.education.forEach(edu => {
        resume.addEducation({
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          description: edu.description
        });
      });
    }
    
    // Add experience items
    if (input.experience && input.experience.length > 0) {
      input.experience.forEach(exp => {
        resume.addExperience({
          company: exp.company,
          position: exp.position,
          location: exp.location,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          description: exp.description,
          achievements: exp.achievements
        });
      });
    }
    
    // Add skills
    if (input.skills && input.skills.length > 0) {
      input.skills.forEach(skillName => {
        resume.addSkill({
          name: skillName
        });
      });
    }
    
    // Add projects
    if (input.projects && input.projects.length > 0) {
      input.projects.forEach(project => {
        resume.addProject({
          name: project.name,
          description: project.description,
          url: project.url,
          technologies: project.technologies
        });
      });
    }
    
    // Save resume to repository
    await this.resumeRepository.create(resume);
    
    // Return output
    return {
      id: resume.getId(),
      title: resume.getTitle(),
      createdAt: resume.getCreatedAt(),
      updatedAt: resume.getUpdatedAt()
    };
  }
} 