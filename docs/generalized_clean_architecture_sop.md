# Generalized Clean Architecture Standard Operating Procedures

This document outlines a generalized standard operating procedure for implementing Clean Architecture in any software project. These rules ensure consistent, maintainable, and testable code regardless of the specific technology stack or business domain.

## 1. Project Structure

### Rule 1.1: Module-Based Organization
Organize the codebase into separate modules that represent different business domains or features.

**Example:**
```
src/
├── modules/
│   ├── module-a/
│   ├── module-b/
│   └── module-c/
└── shared/
    ├── factories/
    ├── services/
    └── utils/
```

### Rule 1.2: Layer Separation within Modules
Each module must follow a clean architecture pattern with clear separation of concerns across the following layers:

**Example:**
```
modules/module-a/
├── domain/           # Business logic and entities
│   ├── entities/
│   ├── interfaces/
│   └── services/
├── application/      # Use cases and application logic
│   ├── useCases/
│   ├── interfaces/
│   └── dtos/
├── presentation/     # UI, API, or other interfaces
│   ├── controllers/
│   ├── views/
│   └── interfaces/
├── infrastructure/   # External frameworks and tools
└── adapters/         # Adapters for external services
```

## 2. Domain Layer

### Rule 2.1: Entity Definition
Entities must represent the core business objects with their properties and behaviors. They should be implemented with proper encapsulation through private properties and public methods.

**Example:**
```typescript
// Generic entity pattern
export class Entity {
  private props: EntityProps;
  
  static create(props: EntityProps) {
    const entity = new Entity();
    entity.props = props;
    return entity;
  }

  // Public getters
  getProperty() {
    return this.props.property;
  }
  
  // Domain behavior methods
  performBusinessOperation() {
    // Business logic here
    this.props.property = newValue;
  }
}
```

### Rule 2.2: Domain Logic Isolation
Business logic must reside within domain entities or domain services, free from any infrastructure, framework, or external service dependencies.

**Example:**
```typescript
// Domain service example
export class DomainService {
  performOperation(entity1: Entity1, entity2: Entity2): OperationResult {
    // Pure business logic, no external dependencies
    if (entity1.getProperty() > entity2.getProperty()) {
      return OperationResult.create({ status: 'success' });
    }
    return OperationResult.create({ status: 'failed' });
  }
}
```

## 3. Application Layer

### Rule 3.1: Use Case Implementation
Use cases must be implemented as classes with a single primary method (usually `execute`) that orchestrates the business logic flow.

**Example:**
```typescript
// Generic use case pattern
export class UseCase {
  constructor(
    private primaryRepo: PrimaryRepository,
    private secondaryRepo: SecondaryRepository,
    private domainService: DomainService
  ) {}

  async execute(request: RequestDto): Promise<ResponseDto> {
    // 1. Get data from repositories
    const entity = await this.primaryRepo.getById(request.id);
    if (!entity) {
      throw new Error('Entity not found');
    }
    
    // 2. Execute domain logic
    const secondaryData = await this.secondaryRepo.getRelatedData(request.id);
    const result = this.domainService.performOperation(entity, secondaryData);
    
    // 3. Return mapped response
    return {
      id: entity.getId(),
      status: result.getStatus(),
      // Additional mapped properties
    };
  }
}
```

### Rule 3.2: Factory Pattern for Use Cases
Each use case should have a corresponding factory that handles its instantiation and dependency injection.

**Example:**
```typescript
// Generic factory pattern
export class UseCaseFactory {
  static create(context?: any) {
    // Instantiate or retrieve repositories and services
    const primaryRepo = new PrimaryRepositoryImpl();
    const secondaryRepo = new SecondaryRepositoryImpl();
    const domainService = new DomainServiceImpl();
    
    // Create and return the use case with injected dependencies
    return new UseCase(
      primaryRepo,
      secondaryRepo,
      domainService
    );
  }
}
```

### Rule 3.3: DTOs for Data Transfer
Use Data Transfer Objects (DTOs) to pass data between layers with clear input/output contracts.

**Example:**
```typescript
// Request DTO
export interface RequestDto {
  id: string;
  optionalData?: string;
}

// Response DTO
export interface ResponseDto {
  id: string;
  status: string;
  data: {
    property1: string;
    property2: number;
  };
}
```

## 4. Presentation Layer

### Rule 4.1: Controllers for Request Handling
Controllers must handle external requests, validate inputs, delegate to use cases, and format responses.

**Example:**
```typescript
// Generic controller pattern
export class Controller {
  async handleRequest(request: any, context: any) {
    // 1. Extract and validate input
    const validatedInput = this.validateInput(request);
    
    // 2. Prepare request DTO
    const requestDto = {
      id: validatedInput.id,
      // Map other properties
    };
    
    // 3. Execute use case
    const useCase = UseCaseFactory.create(context);
    
    try {
      const result = await useCase.execute(requestDto);
      
      // 4. Format and return response
      return {
        success: true,
        data: result
      };
    } catch (error) {
      // 5. Handle errors
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  private validateInput(request: any) {
    // Input validation logic
    return validatedInput;
  }
}
```

### Rule 4.2: Input Validation
All input data must be validated at the presentation layer before passing to use cases.

**Example:**
```typescript
// Generic validation example
function validateInput(input: any): ValidatedInput {
  if (!input.id) {
    throw new Error('ID is required');
  }
  
  if (input.value && typeof input.value !== 'number') {
    throw new Error('Value must be a number');
  }
  
  return {
    id: input.id,
    value: input.value || 0
  };
}
```

### Rule 4.3: Framework Independence
The presentation layer should adapt to the framework rather than letting the framework dictate the architecture.

**Example:**
```typescript
// Adapting to a web framework
export function adaptToExpressController(controller: Controller) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.handleRequest(req.body, { user: req.user });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
```

## 5. Infrastructure Layer

### Rule 5.1: Repository Implementation
Repositories must implement interfaces defined in the domain layer, providing data access methods.

**Example:**
```typescript
// Domain repository interface
export interface Repository {
  getById(id: string): Promise<Entity | undefined>;
  save(entity: Entity): Promise<void>;
  // Other methods...
}

// Infrastructure implementation
export class RepositoryImpl implements Repository {
  constructor(private dataSource: any) {}
  
  async getById(id: string): Promise<Entity | undefined> {
    const data = await this.dataSource.findById(id);
    if (!data) return undefined;
    return Entity.create(data);
  }
  
  async save(entity: Entity): Promise<void> {
    await this.dataSource.save({
      id: entity.getId(),
      // Map other properties
    });
  }
}
```

### Rule 5.2: External Services Abstraction
External services must be abstracted behind interfaces and implemented in the infrastructure layer.

**Example:**
```typescript
// Service interface in domain
export interface ExternalService {
  performAction(data: any): Promise<any>;
}

// Implementation in infrastructure
export class ExternalServiceImpl implements ExternalService {
  constructor(private apiClient: any) {}
  
  async performAction(data: any): Promise<any> {
    try {
      const response = await this.apiClient.post('/endpoint', data);
      return response.data;
    } catch (error) {
      // Handle or rethrow error
      throw new Error(`Service error: ${error.message}`);
    }
  }
}
```

## 6. Data Mapping

### Rule 6.1: Mappers for Data Transformation
Use mapper classes to transform data between different layer representations.

**Example:**
```typescript
// Generic mapper pattern
export class Mapper {
  // Map from domain entity to DTO
  static toDto(entity: Entity): EntityDto {
    return {
      id: entity.getId(),
      name: entity.getName(),
      // Map other properties
    };
  }
  
  // Map from external data to domain entity
  static toDomain(data: any): Entity {
    return Entity.create({
      id: data.id,
      name: data.name,
      // Map other properties
    });
  }
}
```

## 7. Dependency Management

### Rule 7.1: Dependency Inversion
Dependencies must flow inward, with inner layers defining interfaces that outer layers implement.

**Implementation Guide:**
1. Domain layer defines repository and service interfaces
2. Infrastructure layer implements these interfaces
3. Use cases depend on the interfaces, not implementations

### Rule 7.2: Dependency Injection
Use constructor injection to provide dependencies to classes, making testing and replacement easier.

**Example:**
```typescript
// Constructor dependency injection
class Service {
  constructor(
    private repository: Repository,
    private externalService: ExternalService,
    private logger: Logger
  ) {}
  
  // Methods using injected dependencies
}
```

## 8. Shared Code

### Rule 8.1: Utility Functions
Common utility functions should be placed in a shared directory and imported where needed.

**Example:**
```typescript
// Shared utilities
export class DateFormatter {
  static formatToISO(date: Date): string {
    return date.toISOString();
  }
}

export class StringUtils {
  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
```

### Rule 8.2: Common Domain Concepts
Shared domain concepts should be placed in a common domain directory, accessible to all modules.

**Example:**
```typescript
// Common value objects
export class Money {
  constructor(private amount: number, private currency: string) {}
  
  getAmount(): number {
    return this.amount;
  }
  
  getCurrency(): string {
    return this.currency;
  }
  
  add(money: Money): Money {
    if (money.getCurrency() !== this.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + money.getAmount(), this.currency);
  }
}
```

## 9. Testing

### Rule 9.1: Unit Testing
Each layer must have appropriate unit tests with mocked dependencies.

**Example:**
```typescript
// Unit testing a use case
describe('UseCase', () => {
  let useCase: UseCase;
  let mockRepository: MockRepository;
  
  beforeEach(() => {
    mockRepository = {
      getById: jest.fn(),
      save: jest.fn()
    };
    useCase = new UseCase(mockRepository);
  });
  
  it('should return the expected result', async () => {
    // Arrange
    const testEntity = Entity.create({ id: '123', name: 'Test' });
    mockRepository.getById.mockResolvedValue(testEntity);
    
    // Act
    const result = await useCase.execute({ id: '123' });
    
    // Assert
    expect(result).toEqual({ id: '123', name: 'Test' });
    expect(mockRepository.getById).toHaveBeenCalledWith('123');
  });
});
```

### Rule 9.2: Test Domain Logic in Isolation
Domain logic must be tested independently from infrastructure concerns.

**Example:**
```typescript
// Testing domain entity logic
describe('Entity', () => {
  it('should perform business operation correctly', () => {
    // Arrange
    const entity = Entity.create({ value: 10 });
    
    // Act
    entity.performBusinessOperation(5);
    
    // Assert
    expect(entity.getValue()).toBe(15);
  });
});
```

## 10. Error Handling

### Rule 10.1: Domain Errors
Define specific error types for domain-level errors.

**Example:**
```typescript
// Domain-specific errors
export class EntityNotFoundError extends Error {
  constructor(entityId: string) {
    super(`Entity with ID ${entityId} not found`);
    this.name = 'EntityNotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Rule 10.2: Centralized Error Handling
Handle errors at the presentation layer, providing consistent error responses.

**Example:**
```typescript
// Error handling middleware
function errorHandler(error: any, request: any, response: any, next: any) {
  if (error instanceof EntityNotFoundError) {
    return response.status(404).json({
      success: false,
      error: error.message
    });
  }
  
  if (error instanceof ValidationError) {
    return response.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  // Log unexpected errors
  logger.error(error);
  
  return response.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}
```

## 11. Configuration Management

### Rule 11.1: Environment-Based Configuration
Use environment-based configuration for settings that change between environments.

**Example:**
```typescript
// Configuration service
export class ConfigService {
  private config: Record<string, any>;
  
  constructor() {
    this.config = {
      apiUrl: process.env.API_URL,
      dbConnection: process.env.DB_CONNECTION,
      loggingLevel: process.env.LOGGING_LEVEL || 'info'
    };
  }
  
  get(key: string): any {
    return this.config[key];
  }
}
```

## 12. Documentation

### Rule 12.1: Code Documentation
Document public interfaces, complex logic, and architectural decisions.

**Example:**
```typescript
/**
 * Processes a payment transaction
 * @param payment - The payment details
 * @returns A payment result with transaction ID and status
 * @throws PaymentFailedError if the payment processor rejects the payment
 */
async processPayment(payment: Payment): Promise<PaymentResult> {
  // Implementation...
}
```

### Rule 12.2: Architecture Documentation
Maintain documentation that explains the overall architecture, module boundaries, and layer responsibilities.

## 13. Performance Considerations

### Rule 13.1: Performance-Critical Paths
Identify and optimize performance-critical paths while maintaining clean architecture principles.

**Example:**
```typescript
// Caching repository wrapper
export class CachedRepository implements Repository {
  constructor(
    private repository: Repository,
    private cache: CacheService
  ) {}
  
  async getById(id: string): Promise<Entity | undefined> {
    // Check cache first
    const cached = await this.cache.get(`entity:${id}`);
    if (cached) return Entity.create(JSON.parse(cached));
    
    // Fall back to repository
    const entity = await this.repository.getById(id);
    if (entity) {
      // Update cache
      await this.cache.set(`entity:${id}`, JSON.stringify(entity.getProps()), 3600);
    }
    
    return entity;
  }
}
```

## 14. Naming Conventions

### Rule 14.1: Layer-Specific Naming Patterns
Apply consistent naming patterns based on the architectural layer.

**Example:**
```
Domain Layer:
- Entities: PascalCase (e.g., `Resume`, `User`)
- Interfaces: `I` prefix (e.g., `IResumeRepository`)
- Enums: `E` prefix (e.g., `EResumeStatus`)
- Value Objects: PascalCase (e.g., `DateRange`)

Application Layer:
- Use Cases: Verb + Noun + "UseCase" (e.g., `CreateResumeUseCase`)
- Services: Noun + "Service" (e.g., `ResumeValidationService`)
- DTOs: Noun + "Dto" (e.g., `ResumeDto`)

Infrastructure Layer:
- Implementations: Interface name + "Impl" (e.g., `ResumeRepositoryImpl`)
- API Clients: Noun + "ApiClient" (e.g., `ResumeApiClient`)

Presentation Layer:
- Components: PascalCase (e.g., `ResumeEditor`)
- Pages: Noun + "Page" (e.g., `ResumeEditorPage`)
- Hooks: "use" + Feature (e.g., `useResume`)
```

### Rule 14.2: Files and Directory Naming
Follow consistent naming for files and directories.

**Example:**
```
Files:
- Use kebab-case for directories: user-management/
- Use camelCase or kebab-case for files (based on language conventions):
  - TypeScript/JavaScript: userRepository.ts or user-repository.ts
  - Java: UserRepository.java
  - Python: user_repository.py
- Add suffixes to indicate file purpose:
  - Interfaces: IResumeRepository.ts
  - DTOs: ResumeDto.ts
  - Entities: Resume.ts
  - Use cases: CreateResumeUseCase.ts

Directories:
- Use domain terminology for module names: /resume-management
- Use layer names for subdirectories: /domain, /application, /infrastructure, /presentation
- Group by feature within layers: /domain/entities, /domain/interfaces
```

### Rule 14.3: Class and Interface Naming
Use descriptive and consistent naming patterns for classes and interfaces.

**Example:**
```typescript
// Interfaces should start with "I"
export interface IUserRepository { ... }

// Implementations should have a descriptive name with "Impl" suffix
export class UserRepositoryImpl implements IUserRepository { ... }

// Enums should start with "E"
export enum EUserStatus {
  Active,
  Inactive,
  Suspended
}

// Use cases should follow Verb + Noun + "UseCase" pattern
export class CreateUserUseCase { ... }

// Entities should be named as nouns in PascalCase
export class User { ... }

// Value objects should represent their purpose in PascalCase
export class EmailAddress { ... }

// Services should follow Noun + "Service" pattern
export class UserValidationService { ... }
```

### Rule 14.4: Method and Function Naming
Use descriptive action verbs for methods and functions.

**Example:**
```typescript
// Use verbs for methods that perform actions
async createUser(data: UserDto): Promise<User> { ... }
async updateUserProfile(id: string, data: UserDto): Promise<User> { ... }
async deleteUser(id: string): Promise<void> { ... }

// Use "get" prefix for accessor methods
getUserById(id: string): Promise<User | undefined> { ... }
getUsersByRole(role: string): Promise<User[]> { ... }

// Use "is/has/should" prefixes for boolean methods
isValidEmail(email: string): boolean { ... }
hasPermission(user: User, permission: string): boolean { ... }
shouldProcessOrder(order: Order): boolean { ... }

// Use "to" prefix for data transformation methods
toDto(entity: User): UserDto { ... }
toDomain(dto: UserDto): User { ... }
```

### Rule 14.5: Variable and Parameter Naming
Use descriptive, specific names for variables and parameters.

**Example:**
```typescript
// Use descriptive names that reflect purpose and type
const userRepository = new UserRepositoryImpl();
const activeUsers = await userRepository.findActiveUsers();

// Avoid single-letter variables except for well-known cases (i for index)
for (let i = 0; i < items.length; i++) { ... }

// Boolean variables should use is/has/should prefixes
const isValid = validator.validate(data);
const hasPermission = permissionService.check(user, 'edit');

// Use plurals for arrays/collections
const users = await userRepository.findAll();
const orderIds = orders.map(order => order.id);
```

### Rule 14.6: Constants and Enum Naming
Use UPPER_SNAKE_CASE for constants and PascalCase for enum values with an E prefix for enum types.

**Example:**
```typescript
// Constants
const MAX_LOGIN_ATTEMPTS = 5;
const DEFAULT_PAGE_SIZE = 20;

// Environment variables
const API_URL = process.env.API_URL;

// Enums with the E prefix and PascalCase values
enum EOrderStatus {
  Pending,
  Processing,
  Shipped,
  Delivered,
  Cancelled
}

// String enums with the E prefix
enum EUserRole {
  Admin = 'Admin',
  Editor = 'Editor',
  Viewer = 'Viewer'
}
```

### Rule 14.7: Type Definitions
Use PascalCase for types and add I prefix for interfaces, with descriptive suffixes when appropriate.

**Example:**
```typescript
// Entity types
type UserId = string;
type OrderStatus = 'pending' | 'shipped' | 'delivered';

// DTO interfaces
interface UserDto {
  username: string;
  email: string;
  password: string;
}

// Repository interfaces
interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}

// Response types
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Function types
type ValidationFunction = (data: unknown) => boolean;
type ErrorHandler = (error: Error) => void;
```

### Rule 14.8: Database and External Resource Naming
Use consistent naming for database tables, columns and external resources.

**Example:**
```
Database Tables:
- Use snake_case for table names: user_profiles, order_items
- Use singular form for entity tables: user (not users)
- Use plural for many-to-many junction tables: user_roles

Columns:
- Use snake_case for column names: first_name, created_at
- Use id as primary key name
- Use entity_id pattern for foreign keys: user_id, order_id

External Resources:
- Use kebab-case for API endpoints: /api/user-profiles
- Use descriptive names for queues and topics: user-registration-events
``` 