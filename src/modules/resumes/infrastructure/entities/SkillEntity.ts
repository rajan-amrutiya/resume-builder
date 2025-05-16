import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ResumeEntity } from './ResumeEntity';

@Entity('skills')
export class SkillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resume_id' })
  resumeId: number;

  @ManyToOne(() => ResumeEntity, resume => resume.skills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume: ResumeEntity;

  @Column()
  name: string;

  @Column({ nullable: true })
  level: number;

  @Column({ nullable: true })
  category: string;
} 