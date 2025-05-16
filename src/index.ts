import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { AuthController } from './modules/users/presentation/controllers/AuthController';
import { AuthMiddleware } from './shared/middleware/auth.middleware';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'AI Resume Builder API'
  });
});

// Auth routes
app.post('/api/auth/signup', AuthController.signup);
app.post('/api/auth/signin', AuthController.signin);

// Protected route example
app.get('/api/profile', AuthMiddleware.authenticate, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start listening
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Run server
startServer(); 