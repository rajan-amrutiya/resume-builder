import { Resume } from '../../domain/entities/Resume';
import { IResumeRepository } from '../../domain/interfaces/IResumeRepository';

export interface GetUserResumesUseCaseInput {
  userId: number;
}

export interface GetUserResumesUseCaseOutput {
  resumes: Array<{
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export class GetUserResumesUseCase {
  constructor(private resumeRepository: IResumeRepository) {}

  async execute(input: GetUserResumesUseCaseInput): Promise<GetUserResumesUseCaseOutput> {
    const resumes = await this.resumeRepository.findByUserId(input.userId);
    
    return {
      resumes: resumes.map(resume => ({
        id: resume.getId(),
        title: resume.getTitle(),
        createdAt: resume.getCreatedAt(),
        updatedAt: resume.getUpdatedAt()
      }))
    };
  }
} 