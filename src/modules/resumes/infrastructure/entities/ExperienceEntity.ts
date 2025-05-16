import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ResumeEntity } from './ResumeEntity';

@Entity('experience')
export class ExperienceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resume_id' })
  resumeId: number;

  @ManyToOne(() => ResumeEntity, resume => resume.experience, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume: ResumeEntity;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  achievements: string[];
} 