import { Request, Response } from 'express';
import { GetUserResumesUseCase } from '../../application/useCases/GetUserResumesUseCase';
import { GetResumeByIdUseCase } from '../../application/useCases/GetResumeByIdUseCase';
import { CreateResumeUseCase } from '../../application/useCases/CreateResumeUseCase';

export class ResumeController {
  constructor(
    private readonly getUserResumesUseCase: GetUserResumesUseCase,
    private readonly getResumeByIdUseCase: GetResumeByIdUseCase,
    private readonly createResumeUseCase: CreateResumeUseCase
  ) {}

  async getUserResumes(req: Request, res: Response): Promise<void> {
    try {
      // Ensure user is authenticated and req.user is available
      if (!req.user || !req.user.userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const userId = req.user.userId;
      
      const result = await this.getUserResumesUseCase.execute({ userId });
      
      // Format response according to API contract
      res.status(200).json({
        status: true,
        data: result.resumes.map(resume => ({
          id: resume.id,
          title: resume.title,
          createdAt: resume.createdAt.toISOString(),
          updatedAt: resume.updatedAt.toISOString()
        }))
      });
    } catch (error) {
      console.error('Error getting user resumes:', error);
      res.status(500).json({
        status: false,
        error: {
          message: 'Failed to retrieve resumes',
          code: 'GET_RESUMES_ERROR'
        }
      });
    }
  }

  async getResumeById(req: Request, res: Response): Promise<void> {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const userId = req.user.userId;
      const resumeId = parseInt(req.params.id, 10);
      
      if (isNaN(resumeId)) {
        res.status(400).json({
          status: false,
          error: {
            message: 'Invalid resume ID',
            code: 'INVALID_ID'
          }
        });
        return;
      }
      
      const result = await this.getResumeByIdUseCase.execute({ 
        id: resumeId,
        userId 
      });
      
      if (!result.resume) {
        res.status(404).json({
          status: false,
          error: {
            message: 'Resume not found',
            code: 'RESUME_NOT_FOUND'
          }
        });
        return;
      }
      
      // Format response according to API contract
      res.status(200).json({
        status: true,
        data: {
          id: result.resume.id,
          title: result.resume.title,
          personalInfo: result.resume.personalInfo,
          education: result.resume.education,
          experience: result.resume.experience,
          skills: result.resume.skills,
          projects: result.resume.projects,
          createdAt: result.resume.createdAt.toISOString(),
          updatedAt: result.resume.updatedAt.toISOString()
        }
      });
    } catch (error) {
      console.error('Error getting resume by ID:', error);
      res.status(500).json({
        status: false,
        error: {
          message: 'Failed to retrieve resume',
          code: 'GET_RESUME_ERROR'
        }
      });
    }
  }

  async createResume(req: Request, res: Response): Promise<void> {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const userId = req.user.userId;
      
      // Validate required fields
      if (!req.body.title) {
        res.status(400).json({
          status: false,
          error: {
            message: 'Resume title is required',
            code: 'MISSING_REQUIRED_FIELDS'
          }
        });
        return;
      }
      
      // Prepare input for use case
      const input = {
        userId,
        title: req.body.title,
        personalInfo: req.body.personalInfo,
        education: req.body.education,
        experience: req.body.experience,
        skills: req.body.skills,
        projects: req.body.projects
      };
      
      // Create resume
      const result = await this.createResumeUseCase.execute(input);
      
      // Format response according to API contract
      res.status(201).json({
        status: true,
        data: {
          id: result.id,
          title: result.title,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString()
        }
      });
    } catch (error) {
      console.error('Error creating resume:', error);
      res.status(500).json({
        status: false,
        error: {
          message: 'Failed to create resume',
          code: 'CREATE_RESUME_ERROR'
        }
      });
    }
  }
} 