# API Contract Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All API endpoints require authentication using JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All successful responses will follow this format:

```json
{
  "status": true,
  "data": {
    // Response data here
  }
}
```

All error responses will follow this format:

```json
{
  "status": false,
  "error": {
    "message": "string",
    "code": "string"
  }
}
```

## Endpoints

### 1. Authentication

#### Register User

- **Endpoint**: `POST /auth/signup`
- **Description**: Register a new user
- **Request Body**:

```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

- **Response**:

```json
{
  "status": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### Login User

- **Endpoint**: `POST /auth/signin`
- **Description**: Authenticate user and get token
- **Request Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

- **Response**:

```json
{
  "status": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### Google OAuth

- **Endpoint**: `POST /auth/google`
- **Description**: Authenticate user with Google
- **Request Body**: `{}`
- **Response**:

```json
{
  "status": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### GitHub OAuth

- **Endpoint**: `POST /auth/github`
- **Description**: Authenticate user with GitHub
- **Request Body**: `{}`
- **Response**:

```json
{
  "status": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### Sign Out

- **Endpoint**: `POST /auth/signout`
- **Description**: Sign out current user
- **Request Body**: `{}`
- **Response**:

```json
{
  "status": true,
  "data": null
}
```

#### Get Current User

- **Endpoint**: `GET /auth/me`
- **Description**: Get current authenticated user
- **Response**:

```json
{
  "status": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

### 2. User Management

#### Get User Profile

- **Endpoint**: `GET /users/profile`
- **Description**: Get user profile information
- **Response**:

```json
{
  "status": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### Update User Profile

- **Endpoint**: `PUT /users/update`
- **Description**: Update user profile information
- **Request Body**:

```json
{
  "name": "string",
  "email": "string"
}
```

- **Response**:

```json
{
  "status": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

### 3. Resume Management

#### Create Resume

- **Endpoint**: `POST /resumes`
- **Description**: Create a new resume
- **Request Body**:

```json
{
  "title": "string",
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "summary": "string"
  },
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "skills": ["string"],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "link": "string"
    }
  ]
}
```

- **Response**:

```json
{
  "status": "success",
  "data": {
    "id": "string",
    "title": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Get All Resumes

- **Endpoint**: `GET /resumes`
- **Description**: Get all resumes for authenticated user
- **Response**:

```json
{
  "status": "success",
  "data": {
    "resumes": [
      {
        "id": "string",
        "title": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
}
```

#### Get Resume by ID

- **Endpoint**: `GET /resumes/:id`
- **Description**: Get specific resume details
- **Response**:

```json
{
  "status": "success",
  "data": {
    "id": "string",
    "title": "string",
    "personalInfo": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "summary": "string"
    },
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "field": "string",
        "startDate": "string",
        "endDate": "string",
        "description": "string"
      }
    ],
    "experience": [
      {
        "company": "string",
        "position": "string",
        "startDate": "string",
        "endDate": "string",
        "description": "string"
      }
    ],
    "skills": ["string"],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "technologies": ["string"],
        "link": "string"
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Update Resume

- **Endpoint**: `PUT /resumes/:id`
- **Description**: Update existing resume
- **Request Body**: Same as Create Resume
- **Response**: Same as Get Resume by ID

#### Delete Resume

- **Endpoint**: `DELETE /resumes/:id`
- **Description**: Delete a resume
- **Response**:

```json
{
  "status": "success",
  "message": "Resume deleted successfully"
}
```

### 4. Template Management

#### Get All Templates

- **Endpoint**: `GET /templates`
- **Description**: Get all available resume templates
- **Response**:

```json
{
  "status": "success",
  "data": {
    "templates": [
      {
        "id": "string",
        "name": "string",
        "thumbnail": "string",
        "preview": "string"
      }
    ]
  }
}
```

#### Apply Template

- **Endpoint**: `POST /resumes/:id/apply-template`
- **Description**: Apply a template to a resume
- **Request Body**:

```json
{
  "templateId": "string"
}
```

- **Response**:

```json
{
  "status": "success",
  "data": {
    "id": "string",
    "title": "string",
    "template": {
      "id": "string",
      "name": "string"
    }
  }
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "status": false,
  "error": {
    "message": "string",
    "code": "string"
  }
}
```

Common HTTP Status Codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error