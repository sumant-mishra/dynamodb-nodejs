import { Router } from 'express';
import { internshipRouter } from './internship/internship.router';


export const companyRouter = Router();

companyRouter.use('/internship', internshipRouter);
