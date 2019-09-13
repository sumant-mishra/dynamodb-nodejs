import { Router } from 'express';
const internshipController = require('./internship.controller');

export const internshipRouter = Router();

internshipRouter.route('/').get(internshipController.getGuides);
internshipRouter.route('/').post(internshipController.addNewGuide);
internshipRouter.route('/').put(internshipController.updateGuide);
internshipRouter.route('/').delete(internshipController.deleteGuide);
