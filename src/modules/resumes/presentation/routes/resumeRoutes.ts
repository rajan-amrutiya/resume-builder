import { Router } from "express";
import { AuthMiddleware } from "../../../../shared/middleware/auth.middleware";
import { ResumeController } from "../controllers/ResumeController";
import { GetUserResumesUseCase } from "../../application/useCases/GetUserResumesUseCase";
import { GetResumeByIdUseCase } from "../../application/useCases/GetResumeByIdUseCase";
import { CreateResumeUseCase } from "../../application/useCases/CreateResumeUseCase";
import { TypeORMResumeRepository } from "../../infrastructure/repositories/TypeORMResumeRepository";
import { AppDataSource } from "../../../../config/database";

const router = Router();

// Initialize dependencies
const resumeRepository = new TypeORMResumeRepository(AppDataSource);
const getUserResumesUseCase = new GetUserResumesUseCase(resumeRepository);
const getResumeByIdUseCase = new GetResumeByIdUseCase(resumeRepository);
const createResumeUseCase = new CreateResumeUseCase(resumeRepository);
const resumeController = new ResumeController(
  getUserResumesUseCase,
  getResumeByIdUseCase,
  createResumeUseCase
);

// Routes
router.get("/", AuthMiddleware.authenticate, (req, res) =>
  resumeController.getUserResumes(req, res)
);

// Get resume by ID
router.get("/:id", AuthMiddleware.authenticate, (req, res) =>
  resumeController.getResumeById(req, res)
);

// Create a new resume
router.post("/", AuthMiddleware.authenticate, (req, res) =>
  resumeController.createResume(req, res)
);

export default router;
