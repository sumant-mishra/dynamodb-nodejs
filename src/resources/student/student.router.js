import { Router } from 'express';
import { internshipRouter } from './internship/internship.router';


export const studentRouter = Router();

studentRouter.use('/internship', internshipRouter);