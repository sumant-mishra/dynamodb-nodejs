import { Router } from 'express';
const internshipController = require('./internship.controller');

export const internshipRouter = Router();

internshipRouter.route('/').get(internshipController.getCompanies);
internshipRouter.route('/').post(internshipController.addNewCompany);
internshipRouter.route('/').put(internshipController.updateCompany);
internshipRouter.route('/').delete(internshipController.deleteCompany);
