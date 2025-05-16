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
- MySQL (v8+) - Remote database already configured

### Installation

1. Clone the repository
   ```
   git clone git@github.com:rajan-amrutiya/resume-builder.git (using SSH)
   cd resume-builder
   ```

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
   DB_HOST=SG-Resume-Builder-12570-mysql-master.servers.mongodirector.com
   DB_PORT=3306
   DB_USERNAME=sgroot
   DB_PASSWORD=44Tt&3rVTX0qIpzg
   DB_DATABASE=resume_builder

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Database Information

The application uses a remote MySQL database that is already configured and populated with initial data. The connection details are:

- Host: `SG-Resume-Builder-12570-mysql-master.servers.mongodirector.com`
- Port: `3306`
- Username: `sgroot`
- Password: `44Tt&3rVTX0qIpzg`
- Database: `resume_builder`

The connection uses SSL with `rejectUnauthorized: false` for secure communication.

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
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run seed:user` - Seed a test user (ID: 4)
- `npm run seed:resumes` - Seed sample resumes for user ID 4
- `npm run seed:all` - Run all seed scripts

### Troubleshooting

If you encounter database connection issues:

1. Verify that your `.env` file has the correct database connection settings
2. Check that your network allows connections to the remote database
3. Ensure SSL is properly configured in the database connection

## Deployment

To deploy the application to production:

1. Build the project
   ```
   npm run build
   ```

2. Set the environment variables for production
   ```
   NODE_ENV=production
   PORT=3000
   DB_HOST=SG-Resume-Builder-12570-mysql-master.servers.mongodirector.com
   DB_PORT=3306
   DB_USERNAME=sgroot
   DB_PASSWORD=44Tt&3rVTX0qIpzg
   DB_DATABASE=resume_builder
   JWT_SECRET=your_production_jwt_secret
   ```

3. Run the application
   ```
   npm start
   ```

## License

MIT 