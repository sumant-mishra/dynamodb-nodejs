import { Router } from 'express';
import { internshipRouter } from './internship/internship.router';


export const universitiesRouter = Router();

universitiesRouter.use('/universities', internshipRouter);
