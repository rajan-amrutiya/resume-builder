import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../config/database';
import { UserEntity } from '../entities/UserEntity';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User, EAuthProvider } from '../../domain/entities/User';

export class UserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  /**
   * Map a domain User to a UserEntity
   * @param user Domain User
   * @returns UserEntity
   */
  private toEntity(user: User): UserEntity {
    const props = user.getProps();
    const entity = new UserEntity();
    
    // Only set ID if it exists (for updates)
    if (props.id) {
      entity.id = props.id;
    }
    entity.email = props.email;
    entity.passwordHash = props.passwordHash || '';
    entity.firstName = props.firstName;
    entity.lastName = props.lastName;
    entity.role = props.role;
    entity.authProvider = props.authProvider;
    entity.authProviderUserId = props.authProviderUserId || '';
    entity.isVerified = props.isVerified;
    entity.createdAt = props.createdAt!;
    entity.updatedAt = props.updatedAt!;
    
    return entity;
  }

  /**
   * Map a UserEntity to a domain User
   * @param entity UserEntity
   * @returns Domain User
   */
  private toDomain(entity: UserEntity): User {
    return User.create({
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      firstName: entity.firstName,
      lastName: entity.lastName,
      role: entity.role,
      authProvider: entity.authProvider,
      authProviderUserId: entity.authProviderUserId,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  /**
   * Find a user by ID
   * @param id The user ID
   * @returns The user or undefined if not found
   */
  async findById(id: number): Promise<User | undefined> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.toDomain(entity) : undefined;
  }

  /**
   * Find a user by email
   * @param email The user email
   * @returns The user or undefined if not found
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const entity = await this.repository.findOneBy({ email });
    return entity ? this.toDomain(entity) : undefined;
  }

  /**
   * Find a user by OAuth provider ID
   * @param provider The auth provider
   * @param providerUserId The provider's user ID
   * @returns The user or undefined if not found
   */
  async findByAuthProvider(provider: string, providerUserId: string): Promise<User | undefined> {
    const entity = await this.repository.findOneBy({ 
      authProvider: provider as EAuthProvider,
      authProviderUserId: providerUserId
    });
    return entity ? this.toDomain(entity) : undefined;
  }

  /**
   * Save a user
   * @param user The user to save
   * @returns The saved user
   */
  async save(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  /**
   * Delete a user
   * @param id The user ID
   * @returns True if deleted, false otherwise
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }
} 