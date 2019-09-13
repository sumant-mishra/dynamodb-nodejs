import { Router } from 'express';
import { internshipRouter } from './internship/internship.router';


export const universityRouter = Router();

universityRouter.use('/internship', internshipRouter);