import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EUserRole, EAuthProvider } from '../../domain/entities/User';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: EUserRole,
    default: EUserRole.User
  })
  role: EUserRole;

  @Column({
    type: 'enum',
    enum: EAuthProvider
  })
  authProvider: EAuthProvider;

  @Column({ nullable: true })
  authProviderUserId: string;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 