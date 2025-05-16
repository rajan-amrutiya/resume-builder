# Clean Architecture Standard Operating Procedures

This document outlines the standard operating procedures for implementing Clean Architecture in our project. These rules ensure consistent, maintainable, and testable code across the application.

## 1. Project Structure

### Rule 1.1: Module-Based Organization
Organize the codebase into separate modules that represent different business domains.

**Example:**
```
src/clean-architecture/
├── modules/
│   ├── find-agent/
│   └── enquiries/
└── shared/
    ├── factories/
    ├── services/
    └── utils/
```

### Rule 1.2: Layer Separation within Modules
Each module must follow a clean architecture pattern with clear separation of concerns across the following layers:

**Example:**
```
modules/find-agent/
├── domain/
│   ├── entities/
│   ├── interfaces/
│   └── services/
├── application/
│   ├── useCases/
│   ├── constants/
│   └── interfaces/
├── presentation/
│   ├── controllers/
│   ├── routes/
│   ├── validation/
│   └── interfaces/
├── infrastructure/
├── repositories/
├── services/
├── mappers/
└── dtos/
```

## 2. Domain Layer

### Rule 2.1: Entity Definition
Entities must be implemented as classes with private properties and public getters, enforcing encapsulation.

**Example:**
```typescript
// domain/entities/agentDetails.ts
export class AgentDetails {
  private props: AgentDetailsProps;
  
  static create(details: AgentDetailsProps) {
    const agentDetail = new AgentDetails();
    agentDetail.props = details;
    return agentDetail;
  }

  getId() {
    return this.props.id;
  }

  getFirstName() {
    return this.props.firstName;
  }
  
  // Additional getters...
}
```

### Rule 2.2: Domain Logic Isolation
Business logic must reside within domain entities or domain services, free from infrastructure or framework dependencies.

## 3. Application Layer

### Rule 3.1: Use Case Implementation
Use cases must be implemented as classes with a single `execute` method that handles the business logic flow.

**Example:**
```typescript
// application/useCases/getAgentProfile/getAgentProfile.ts
export class GetAgentProfile {
  constructor(
    private agentRepo: AgentRepo,
    private listingRepo: ListingRepo,
    // Additional dependencies...
  ) {}

  async execute(dto: GetAgentProfileRequestDto): Promise<GetAgentProfileResponseDto | void> {
    const agentDetail = await this.getAgentDetails(dto.agentId);
    if (!agentDetail) {
      return;
    }
    
    // Business logic flow...
    
    return result;
  }
  
  // Private helper methods...
}
```

### Rule 3.2: Factory Pattern for Use Cases
Each use case must have a corresponding factory that handles its instantiation and dependency injection.

**Example:**
```typescript
// application/useCases/getAgentProfile/getAgentProfileFactory.ts
export class GetAgentProfileFactory {
  static async create(req: Request) {
    // Instantiate repositories, services and other dependencies
    const agentRepo = new AgentRepositoryImpl();
    const listingRepo = new ListingRepositoryImpl();
    
    // Create and return the use case with injected dependencies
    return {
      useCase: new GetAgentProfile(
        agentRepo,
        listingRepo,
        // Additional dependencies...
      ),
      loggerService: new LoggerService()
    };
  }
}
```

### Rule 3.3: DTOs for Data Transfer
Use Data Transfer Objects (DTOs) to pass data between layers with clear input/output contracts.

**Example:**
```typescript
// application/useCases/getAgentProfile/getAgentProfileRequestDto.ts
export interface StaticMapProps {
  mapHeight?: number;
  mapWidth?: number;
  isBot?: boolean;
}

export interface GetAgentProfileRequestDto {
  agentId: number;
  staticMapProps?: StaticMapProps;
}

// application/useCases/getAgentProfile/getAgentProfileResponseDto.ts
export interface AgentDetailResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  // Additional properties...
}

export interface GetAgentProfileResponseDto extends AgentDetailResponseDto {
  agencyDetail: AgencyDetailsProps;
  breadcrumbs: any[];
  staticMapImage?: string;
  seoLinks?: any;
  listings?: {
    total: number;
    data: any[];
  };
}
```

## 4. Presentation Layer

### Rule 4.1: Controllers for Request Handling
Controllers must handle HTTP requests, validate inputs, delegate to use cases, and format responses.

**Example:**
```typescript
// presentation/controllers/controller.ts
export class Controller {
  static async getAgentProfile(
    req: ValidatedRequest<QueryValidationRequestSchema<GetAgentProfileRequestParams>>,
    res: Response,
    next: NextFunction
  ) {
    const dto: GetAgentProfileRequestDto = {
      agentId: req.query.id,
      staticMapProps: {
        mapHeight: req.query.mapHeight,
        mapWidth: req.query.mapWidth,
        isBot: req.query.isBot
      }
    };
    
    const { useCase, loggerService } = await GetAgentProfileFactory.create(req);

    try {
      const result = await useCase.execute(dto);

      res.send({
        success: true,
        data: result
      });
    } catch (error) {
      loggerService.errorLog({
        data: error,
        msg: 'Get agent profile'
      });
      return next(error);
    }
  }
}
```

### Rule 4.2: Input Validation
All input data must be validated at the presentation layer before passing to use cases.

**Example:**
```typescript
// presentation/validation/agentProfileValidation.ts
export const agentProfileSchema = Joi.object({
  id: Joi.number().required(),
  mapHeight: Joi.number().optional(),
  mapWidth: Joi.number().optional(),
  isBot: Joi.boolean().optional()
});
```

## 5. Infrastructure Layer

### Rule 5.1: Repository Implementation
Repositories must implement interfaces defined in the domain layer, providing data access methods.

**Example:**
```typescript
// repositories/agentRepository.ts
export interface AgentRepo {
  getDetailsById(id: number): Promise<AgentDetails | undefined>;
  // Additional methods...
}

// repositories/agentRepositoryImpl.ts
export class AgentRepositoryImpl implements AgentRepo {
  async getDetailsById(id: number): Promise<AgentDetails | undefined> {
    const data = await database.agents.findById(id);
    if (!data) return undefined;
    return AgentDetails.create(data);
  }
  // Additional method implementations...
}
```

### Rule 5.2: External Services Abstraction
External services must be abstracted behind interfaces and implemented in the infrastructure layer.

**Example:**
```typescript
// services/staticMapImageService.ts
export interface StaticMapImageService {
  generateMapImage(location: { lat: number; lng: number }, options?: any): Promise<string>;
}

// services/staticMapImageServiceImpl.ts
export class StaticMapImageServiceImpl implements StaticMapImageService {
  async generateMapImage(location: { lat: number; lng: number }, options?: any): Promise<string> {
    // Implementation using external mapping service
  }
}
```

## 6. Data Mapping

### Rule 6.1: Mappers for Data Transformation
Use mapper classes to transform data between different layer representations.

**Example:**
```typescript
// mappers/agentsDetailMapper.ts
export class AgentDetailMapper {
  static toDto(entity: AgentDetails): AgentDetailResponseDto {
    const props = entity.getDetails();
    return {
      id: props.id,
      firstName: props.firstName,
      lastName: props.lastName,
      // Map additional properties...
    };
  }
  
  static toDomain(dto: any): AgentDetails {
    return AgentDetails.create({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      // Map additional properties...
    });
  }
}
```

## 7. Dependency Management

### Rule 7.1: Dependency Inversion
Dependencies must flow inward, with inner layers defining interfaces that outer layers implement.

### Rule 7.2: Dependency Injection
Use constructor injection to provide dependencies to classes, making testing and replacement easier.

**Example:**
```typescript
// Injecting dependencies via constructor
constructor(
  private agentRepo: AgentRepo,
  private listingRepo: ListingRepo,
  private agencyRepo: AgencyRepo
) {}
```

## 8. Shared Code

### Rule 8.1: Utility Functions
Common utility functions should be placed in the shared directory and imported where needed.

**Example:**
```typescript
// shared/utils/wordFormatter.ts
export class WordFormatter {
  static capitalise(text: string): string {
    // Implementation
  }
}

// shared/utils/currencyFormatter.ts
export class CurrencyFormatter {
  static format(value: number): string {
    // Implementation
  }
}
```

## 9. Testing

### Rule 9.1: Unit Testing
Each layer must have appropriate unit tests with mocked dependencies.

### Rule 9.2: Test Domain Logic in Isolation
Domain logic must be tested independently from infrastructure concerns.

## 10. Error Handling

### Rule 10.1: Centralized Error Handling
Handle errors at the presentation layer, providing consistent error responses.

**Example:**
```typescript
try {
  const result = await useCase.execute(dto);
  res.send({
    success: true,
    data: result
  });
} catch (error) {
  loggerService.errorLog({
    data: error,
    msg: 'Get agent profile'
  });
  return next(error);
}
```
