import { Resume } from '../entities/Resume';

export interface IResumeRepository {
  findById(id: number): Promise<Resume | null>;
  findByUserId(userId: number): Promise<Resume[]>;
  create(resume: Resume): Promise<void>;
  update(resume: Resume): Promise<void>;
  delete(id: number): Promise<void>;
} 