import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ResumeEntity } from './ResumeEntity';
import { ProjectTechnologyEntity } from './ProjectTechnologyEntity';

@Entity('projects')
export class ProjectEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'resume_id' })
  resumeId: string;

  @ManyToOne(() => ResumeEntity, resume => resume.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume: ResumeEntity;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  url: string;

  @OneToMany(() => ProjectTechnologyEntity, technology => technology.project, {
    cascade: true,
    eager: true
  })
  technologies: ProjectTechnologyEntity[];
} 