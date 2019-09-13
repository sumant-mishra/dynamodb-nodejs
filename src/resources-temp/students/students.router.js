import { Router } from 'express';
import { internshipRouter } from './internship/internship.router';


export const studentsRouter = Router();

studentsRouter.use('/students', internshipRouter);
