import { Resume } from '../../domain/entities/Resume';
import { IResumeRepository } from '../../domain/interfaces/IResumeRepository';

export interface GetResumeByIdUseCaseInput {
  id: number;
  userId: number;
}

export interface GetResumeByIdUseCaseOutput {
  resume: {
    id: number;
    title: string;
    personalInfo: any;
    education: any[];
    experience: any[];
    skills: string[];
    projects: any[];
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export class GetResumeByIdUseCase {
  constructor(private resumeRepository: IResumeRepository) {}

  async execute(input: GetResumeByIdUseCaseInput): Promise<GetResumeByIdUseCaseOutput> {
    // Find resume by ID
    const resume = await this.resumeRepository.findById(input.id);
    
    // Check if resume exists
    if (!resume) {
      return { resume: null };
    }
    
    // Ensure user owns this resume
    if (resume.getUserId() !== input.userId) {
      return { resume: null };
    }
    
    // Return resume data
    return {
      resume: {
        id: resume.getId(),
        title: resume.getTitle(),
        personalInfo: resume.getContactInformation(),
        education: resume.getEducation(),
        experience: resume.getExperience(),
        skills: resume.getSkills().map(skill => skill.name),
        projects: resume.getProjects() || [],
        createdAt: resume.getCreatedAt(),
        updatedAt: resume.getUpdatedAt()
      }
    };
  }
} 