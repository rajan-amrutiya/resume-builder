import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ResumeEntity } from './ResumeEntity';

@Entity('languages')
export class LanguageEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'resume_id' })
  resumeId: string;

  @ManyToOne(() => ResumeEntity, resume => resume.languages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume: ResumeEntity;

  @Column()
  name: string;

  @Column()
  proficiency: string;
} 