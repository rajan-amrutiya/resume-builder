# AI Resume Builder Backend

This is the backend for the AI Resume Builder application, built with Node.js, TypeScript, Express, and TypeORM.

## Project Structure

The project follows a clean architecture pattern with the following layers:

- **Presentation**: Controllers and routes
- **Application**: Use cases and DTOs
- **Domain**: Entities and business logic
- **Infrastructure**: Database access and external services

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MySQL (v8+)

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file based on the following template:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=resume_builder

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```

4. Create a MySQL database
   ```
   CREATE DATABASE resume_builder;
   ```

5. Run database migrations
   ```
   npm run migration:run
   ```

6. Start the development server
   ```
   npm run dev
   ```

## API Documentation

The API follows RESTful principles and provides the following endpoints:

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login a user
- `GET /api/auth/me` - Get current user info

### Resumes

- `GET /api/resumes` - Get all resumes for current user
- `GET /api/resumes/:id` - Get a resume by ID
- `POST /api/resumes` - Create a new resume
- `PUT /api/resumes/:id` - Update a resume
- `DELETE /api/resumes/:id` - Delete a resume

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project
- `npm start` - Run the built project
- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run migrations
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## License

MIT 