import { v4 as uuidv4 } from 'uuid';

export enum EUserRole {
  Admin = 'Admin',
  User = 'User'
}

export enum EAuthProvider {
  Local = 'Local',
  Google = 'Google',
  GitHub = 'GitHub'
}

export interface UserProps {
  id?: number;
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  role: EUserRole;
  authProvider: EAuthProvider;
  authProviderUserId?: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = {
      ...props,
      // Since we're using auto-increment IDs, no need to generate an ID here
      // id will be assigned by the database
      role: props.role || EUserRole.User,
      isVerified: props.isVerified !== undefined ? props.isVerified : false,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  // Factory method to create a new user
  public static create(props: UserProps): User {
    return new User(props);
  }

  // Factory method for local authentication
  public static createLocalUser(
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    role: EUserRole = EUserRole.User
  ): User {
    return new User({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      authProvider: EAuthProvider.Local,
      isVerified: false
    });
  }

  // Factory method for OAuth authentication
  public static createOAuthUser(
    email: string,
    firstName: string,
    lastName: string,
    authProvider: EAuthProvider,
    authProviderUserId: string
  ): User {
    return new User({
      email,
      firstName,
      lastName,
      role: EUserRole.User,
      authProvider,
      authProviderUserId,
      isVerified: true
    });
  }

  // Getters
  public getId(): number {
    return this.props.id!;
  }

  public getEmail(): string {
    return this.props.email;
  }

  public getPasswordHash(): string | undefined {
    return this.props.passwordHash;
  }

  public getFirstName(): string {
    return this.props.firstName;
  }

  public getLastName(): string {
    return this.props.lastName;
  }

  public getFullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  public getRole(): EUserRole {
    return this.props.role;
  }

  public getAuthProvider(): EAuthProvider {
    return this.props.authProvider;
  }

  public getAuthProviderUserId(): string | undefined {
    return this.props.authProviderUserId;
  }

  public isUserVerified(): boolean {
    return this.props.isVerified;
  }

  public getCreatedAt(): Date {
    return this.props.createdAt!;
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt!;
  }

  // Domain operations
  public verifyUser(): void {
    this.props.isVerified = true;
    this.props.updatedAt = new Date();
  }

  public updateProfile(firstName: string, lastName: string): void {
    this.props.firstName = firstName;
    this.props.lastName = lastName;
    this.props.updatedAt = new Date();
  }

  public updatePassword(passwordHash: string): void {
    if (this.props.authProvider !== EAuthProvider.Local) {
      throw new Error("Cannot update password for OAuth users");
    }
    this.props.passwordHash = passwordHash;
    this.props.updatedAt = new Date();
  }

  public updateRole(role: EUserRole): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  // Get all properties as a plain object
  public getProps(): UserProps {
    return { ...this.props };
  }
} 