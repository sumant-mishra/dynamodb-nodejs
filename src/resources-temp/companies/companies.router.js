import { Router } from 'express';
import { internshipRouter } from './internship/internship.router';


export const companiesRouter = Router();

companiesRouter.use('/companies', internshipRouter);
