import { Router } from 'express';
import { internshipRouter } from './internship/internship.router';


export const guidesRouter = Router();

guidesRouter.use('/guides', internshipRouter);
