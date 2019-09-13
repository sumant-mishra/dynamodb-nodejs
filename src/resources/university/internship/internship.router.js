import { Router } from 'express';
const internshipController = require('./internship.controller');

export const internshipRouter = Router();

internshipRouter.route('/proposals').get(internshipController.getProposalsListForUniversity);
internshipRouter.route('/assignguide').post(internshipController.assignGuide);
internshipRouter.route('/profilenames').get(internshipController.getProfileNames);
internshipRouter.route('/studentdetails/:id').get(internshipController.getStudentDetails);
internshipRouter.route('/guides').get(internshipController.getGuides);
internshipRouter.route('/approvals').get(internshipController.getProposalApprovalsData);
internshipRouter.route('/approvals').post(internshipController.updateApprovalStatus);


/* const universityController = require('./university.controller');

module.exports = function (router) {
    
    //router.get('/internship/proposals/university'
    router.get('/internship/university/proposals', universityController.getProposalsListForUniversity);

    //router.post('/internship/proposals/university/assignguide'
    router.post('/internship/university/assignguide', universityController.assignGuide);

    //router.get('/internship/proposals/profilenames'
    router.get('/internship/university/profilenames', universityController.getProfileNames)

    //router.get('/internship/proposals/university/company/studentdetails/:id'
    router.get('/internship/university/studentdetails/:id', universityController.getStudentDetails);

    //router.get('/guides'
    router.get('/internship/university/guides', universityController.getGuides);

    //router.get('/university/approvals'
    router.get('/internship/university/approvals', universityController.getProposalApprovalsData);

    //router.post('/students'
    router.post('/internship/university/approvals', universityController.updateApprovalStatus);
    

} */