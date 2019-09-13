import { Router } from 'express';
const internshipController = require('./internship.controller');

export const internshipRouter = Router();

internshipRouter.route('/').get(internshipController.getUniversities);
internshipRouter.route('/').post(internshipController.addNewUniversity);
internshipRouter.route('/').put(internshipController.updateUniversity);
internshipRouter.route('/').delete(internshipController.deleteUniversity);
