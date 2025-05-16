import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ResumeEntity } from './ResumeEntity';

@Entity('education')
export class EducationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resume_id' })
  resumeId: number;

  @ManyToOne(() => ResumeEntity, resume => resume.education, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume: ResumeEntity;

  @Column()
  institution: string;

  @Column()
  degree: string;

  @Column({ name: 'field_of_study' })
  fieldOfStudy: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;
} 