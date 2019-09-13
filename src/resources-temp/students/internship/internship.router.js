import { Router } from 'express';
const internshipController = require('./internship.controller');

export const internshipRouter = Router();

internshipRouter.route('/').get(internshipController.getStudents);
internshipRouter.route('/').post(internshipController.addNewStudent);
internshipRouter.route('/').put(internshipController.updateStudent);
internshipRouter.route('/').delete(internshipController.deleteStudent);
