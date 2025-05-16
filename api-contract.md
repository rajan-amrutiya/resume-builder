# Resume Builder API Contract

## Base URL
```
https://api.resumebuilder.com/api
```

## Authentication
All protected routes require a JWT token sent in the `Authorization` header:
```
Authorization: Bearer <your_token>
```

## API Endpoints

### Authentication

#### Register User
```
POST /auth/signup
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "token": "jwt-token-string"
  }
}
```

**Error Response (400 Bad Request)**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

#### Login User
```
POST /auth/signin
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "token": "jwt-token-string"
  }
}
```

**Error Response (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### Google OAuth Callback
```
GET /auth/google/callback
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "token": "jwt-token-string"
  }
}
```

**Error Response (501 Not Implemented)**
```json
{
  "success": false,
  "message": "Not implemented yet"
}
```

#### GitHub OAuth Callback
```
GET /auth/github/callback
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "token": "jwt-token-string"
  }
}
```

**Error Response (501 Not Implemented)**
```json
{
  "success": false,
  "message": "Not implemented yet"
}
```

#### Get User Profile
```
GET /profile
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "provider": "local"
  }
}
```

**Error Response (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Resume Management

#### Create Resume
```
POST /resumes
```

**Request Body**
```json
{
  "title": "My Resume",
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "location": "New York, NY",
    "summary": "Experienced software developer..."
  },
  "education": [
    {
      "institution": "University of Example",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2016-09-01",
      "endDate": "2020-05-31",
      "description": "Graduated with honors..."
    }
  ],
  "experience": [
    {
      "company": "Tech Company Inc.",
      "position": "Software Engineer",
      "startDate": "2020-06-15",
      "endDate": null,
      "description": "Developing web applications using React..."
    }
  ],
  "skills": [
    "JavaScript",
    "React",
    "Node.js",
    "TypeScript"
  ],
  "projects": [
    {
      "name": "Personal Website",
      "description": "Built my portfolio website...",
      "link": "https://example.com",
      "technologies": [
        "React",
        "Next.js",
        "TailwindCSS"
      ]
    }
  ]
}
```

**Response (201 Created)**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "title": "My Resume",
    "createdAt": "2023-09-15T12:30:45Z",
    "updatedAt": "2023-09-15T12:30:45Z"
  }
}
```

**Error Response (500 Internal Server Error)**
```json
{
  "status": false,
  "error": {
    "message": "Failed to create resume",
    "code": "CREATE_RESUME_ERROR"
  }
}
```

#### Get User's Resumes
```
GET /resumes
```

This endpoint returns all resumes belonging to the authenticated user.

**Authorization Required**
Requires a valid JWT token in the Authorization header.

**Response (200 OK)**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "title": "My Resume 1",
      "createdAt": "2023-09-15T12:30:45Z",
      "updatedAt": "2023-09-15T12:30:45Z"
    },
    {
      "id": 2,
      "title": "My Resume 2",
      "createdAt": "2023-09-14T10:20:30Z",
      "updatedAt": "2023-09-14T11:25:35Z"
    }
  ]
}
```

**Error Response (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**Error Response (500 Internal Server Error)**
```json
{
  "status": false,
  "error": {
    "message": "Failed to retrieve resumes",
    "code": "GET_RESUMES_ERROR"
  }
}
```

#### Get Resume by ID
```
GET /resumes/:id
```

**Response (200 OK)**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "title": "My Resume",
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "location": "New York, NY",
      "summary": "Experienced software developer..."
    },
    "education": [
      {
        "id": 1,
        "institution": "University of Example",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "startDate": "2016-09-01",
        "endDate": "2020-05-31",
        "description": "Graduated with honors..."
      }
    ],
    "experience": [
      {
        "id": 1,
        "company": "Tech Company Inc.",
        "position": "Software Engineer",
        "startDate": "2020-06-15",
        "endDate": null,
        "description": "Developing web applications using React..."
      }
    ],
    "skills": [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript"
    ],
    "projects": [
      {
        "id": 1,
        "name": "Personal Website",
        "description": "Built my portfolio website...",
        "link": "https://example.com",
        "technologies": [
          "React",
          "Next.js",
          "TailwindCSS"
        ]
      }
    ],
    "createdAt": "2023-09-15T12:30:45Z",
    "updatedAt": "2023-09-15T12:30:45Z"
  }
}
```

**Error Response (404 Not Found)**
```json
{
  "status": false,
  "error": {
    "message": "Resume not found",
    "code": "RESUME_NOT_FOUND"
  }
}
```

#### Update Resume
```
PUT /resumes/:id
```

**Request Body**
```json
{
  "title": "Updated Resume Title",
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "location": "New York, NY",
    "summary": "Updated summary text..."
  },
  "education": [
    {
      "id": 1,
      "institution": "University of Example",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2016-09-01",
      "endDate": "2020-05-31",
      "description": "Updated education description..."
    }
  ],
  "experience": [
    {
      "id": 1,
      "company": "Tech Company Inc.",
      "position": "Senior Software Engineer",
      "startDate": "2020-06-15",
      "endDate": null,
      "description": "Updated job description..."
    }
  ],
  "skills": [
    "JavaScript",
    "React",
    "Node.js",
    "TypeScript",
    "GraphQL"
  ],
  "projects": [
    {
      "id": 1,
      "name": "Personal Website",
      "description": "Updated project description...",
      "link": "https://example.com",
      "technologies": [
        "React",
        "Next.js",
        "TailwindCSS"
      ]
    }
  ]
}
```

**Response (200 OK)**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "title": "Updated Resume Title",
    "updatedAt": "2023-09-16T09:15:30Z"
  }
}
```

**Error Response (404 Not Found)**
```json
{
  "status": false,
  "error": {
    "message": "Resume not found",
    "code": "RESUME_NOT_FOUND"
  }
}
```

#### Delete Resume
```
DELETE /resumes/:id
```

**Response (200 OK)**
```json
{
  "status": true,
  "message": "Resume deleted successfully"
}
```

**Error Response (404 Not Found)**
```json
{
  "status": false,
  "error": {
    "message": "Resume not found",
    "code": "RESUME_NOT_FOUND"
  }
}
```

#### Apply Template to Resume
```
POST /resumes/:id/apply-template
```

**Request Body**
```json
{
  "templateId": 5
}
```

**Response (200 OK)**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "title": "My Resume",
    "templateId": 5,
    "updatedAt": "2023-09-16T14:20:10Z"
  }
}
```

**Error Response (404 Not Found)**
```json
{
  "status": false,
  "error": {
    "message": "Resume or template not found",
    "code": "NOT_FOUND_ERROR"
  }
}
```

## Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - The request has succeeded |
| 201 | Created - The request has been fulfilled and a new resource has been created |
| 400 | Bad Request - The request could not be understood or was missing required parameters |
| 401 | Unauthorized - Authentication failed or user does not have permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error occurred |

## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

or 

```json
{
  "status": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
``` 