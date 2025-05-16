import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectEntity } from './ProjectEntity';

@Entity('project_technologies')
export class ProjectTechnologyEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @ManyToOne(() => ProjectEntity, project => project.technologies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @Column()
  technology: string;
} 