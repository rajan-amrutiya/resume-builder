import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from '../../../../modules/users/infrastructure/entities/UserEntity';
import { EResumeStatus } from '../../domain/entities/Resume';
import { EducationEntity } from './EducationEntity';
import { ExperienceEntity } from './ExperienceEntity';
import { SkillEntity } from './SkillEntity';
import { ProjectEntity } from './ProjectEntity';
import { LanguageEntity } from './LanguageEntity';

@Entity('resumes')
export class ResumeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({
    type: 'enum',
    enum: EResumeStatus,
    default: EResumeStatus.Draft
  })
  status: EResumeStatus;

  @Column({ type: 'json', nullable: true })
  contactInformation: {
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };

  @OneToMany(() => EducationEntity, education => education.resume, {
    cascade: true,
    eager: true
  })
  education: EducationEntity[];

  @OneToMany(() => ExperienceEntity, experience => experience.resume, {
    cascade: true,
    eager: true
  })
  experience: ExperienceEntity[];

  @OneToMany(() => SkillEntity, skill => skill.resume, {
    cascade: true,
    eager: true
  })
  skills: SkillEntity[];

  @OneToMany(() => ProjectEntity, project => project.resume, {
    cascade: true,
    eager: true
  })
  projects: ProjectEntity[];

  @OneToMany(() => LanguageEntity, language => language.resume, {
    cascade: true,
    eager: true
  })
  languages: LanguageEntity[];

  @Column({ name: 'template_id', nullable: true })
  templateId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 