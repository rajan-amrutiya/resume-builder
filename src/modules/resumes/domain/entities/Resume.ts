import { v4 as uuidv4 } from 'uuid';

export enum EResumeStatus {
  Draft = 'Draft',
  Published = 'Published',
  Archived = 'Archived'
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  achievements?: string[];
}

export interface Skill {
  id: number;
  name: string;
  level?: number; // 1-5 scale
  category?: string;
}

export interface ResumeProps {
  id?: number;
  userId: number;
  title: string;
  summary?: string;
  status: EResumeStatus;
  contactInformation?: {
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  projects?: {
    id: number;
    name: string;
    description?: string;
    url?: string;
    technologies?: string[];
  }[];
  languages?: {
    id: number;
    name: string;
    proficiency: string;
  }[];
  templateId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Resume {
  private props: ResumeProps;

  private constructor(props: ResumeProps) {
    this.props = {
      ...props,
      status: props.status || EResumeStatus.Draft,
      education: props.education || [],
      experience: props.experience || [],
      skills: props.skills || [],
      projects: props.projects || [],
      languages: props.languages || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  // Factory method to create a new resume
  public static create(props: ResumeProps): Resume {
    return new Resume(props);
  }

  // Getters
  public getId(): number {
    return this.props.id!;
  }

  public getUserId(): number {
    return this.props.userId;
  }

  public getTitle(): string {
    return this.props.title;
  }

  public getSummary(): string | undefined {
    return this.props.summary;
  }

  public getStatus(): EResumeStatus {
    return this.props.status;
  }

  public getContactInformation(): ResumeProps['contactInformation'] {
    return this.props.contactInformation;
  }

  public getEducation(): Education[] {
    return [...this.props.education!];
  }

  public getExperience(): Experience[] {
    return [...this.props.experience!];
  }

  public getSkills(): Skill[] {
    return [...this.props.skills!];
  }

  public getProjects(): ResumeProps['projects'] {
    return this.props.projects ? [...this.props.projects] : [];
  }

  public getLanguages(): ResumeProps['languages'] {
    return this.props.languages ? [...this.props.languages] : [];
  }

  public getTemplateId(): number | undefined {
    return this.props.templateId;
  }

  public getCreatedAt(): Date {
    return this.props.createdAt!;
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt!;
  }

  // Domain operations
  public updateBasicInfo(title: string, summary?: string): void {
    this.props.title = title;
    this.props.summary = summary;
    this.props.updatedAt = new Date();
  }

  public updateStatus(status: EResumeStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  public updateContactInformation(contactInfo: ResumeProps['contactInformation']): void {
    this.props.contactInformation = contactInfo;
    this.props.updatedAt = new Date();
  }

  public addEducation(education: Omit<Education, 'id'>): number {
    const id = this.props.education!.length > 0 
      ? Math.max(...this.props.education!.map(e => e.id)) + 1 
      : 1;
    this.props.education!.push({ ...education, id });
    this.props.updatedAt = new Date();
    return id;
  }

  public updateEducation(educationId: number, education: Partial<Omit<Education, 'id'>>): void {
    const index = this.props.education!.findIndex(e => e.id === educationId);
    if (index === -1) {
      throw new Error(`Education with ID ${educationId} not found`);
    }
    
    this.props.education![index] = {
      ...this.props.education![index],
      ...education
    };
    this.props.updatedAt = new Date();
  }

  public removeEducation(educationId: number): void {
    this.props.education = this.props.education!.filter(e => e.id !== educationId);
    this.props.updatedAt = new Date();
  }

  public addExperience(experience: Omit<Experience, 'id'>): number {
    const id = this.props.experience!.length > 0 
      ? Math.max(...this.props.experience!.map(e => e.id)) + 1 
      : 1;
    this.props.experience!.push({ ...experience, id });
    this.props.updatedAt = new Date();
    return id;
  }

  public updateExperience(experienceId: number, experience: Partial<Omit<Experience, 'id'>>): void {
    const index = this.props.experience!.findIndex(e => e.id === experienceId);
    if (index === -1) {
      throw new Error(`Experience with ID ${experienceId} not found`);
    }
    
    this.props.experience![index] = {
      ...this.props.experience![index],
      ...experience
    };
    this.props.updatedAt = new Date();
  }

  public removeExperience(experienceId: number): void {
    this.props.experience = this.props.experience!.filter(e => e.id !== experienceId);
    this.props.updatedAt = new Date();
  }

  public addSkill(skill: Omit<Skill, 'id'>): number {
    const id = this.props.skills!.length > 0 
      ? Math.max(...this.props.skills!.map(s => s.id)) + 1 
      : 1;
    this.props.skills!.push({ ...skill, id });
    this.props.updatedAt = new Date();
    return id;
  }

  public updateSkill(skillId: number, skill: Partial<Omit<Skill, 'id'>>): void {
    const index = this.props.skills!.findIndex(s => s.id === skillId);
    if (index === -1) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }
    
    this.props.skills![index] = {
      ...this.props.skills![index],
      ...skill
    };
    this.props.updatedAt = new Date();
  }

  public removeSkill(skillId: number): void {
    this.props.skills = this.props.skills!.filter(s => s.id !== skillId);
    this.props.updatedAt = new Date();
  }

  public setTemplateId(templateId: number): void {
    this.props.templateId = templateId;
    this.props.updatedAt = new Date();
  }

  // Get all properties as a plain object
  public getProps(): ResumeProps {
    return { ...this.props };
  }
} 