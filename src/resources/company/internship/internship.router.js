import { Router } from 'express';
const internshipController = require('./internship.controller');

export const internshipRouter = Router();


internshipRouter.route('/proposals').get(internshipController.getInternshipProposals);
internshipRouter.route('/proposals').post(internshipController.saveNewInternshipProposal);
internshipRouter.route('/proposals/:id').put(internshipController.updateInternshipProposal);
internshipRouter.route('/proposals/:ids').delete(internshipController.deleteInternshipProposals);



internshipRouter.route('/status').get(internshipController.getInternshipStatusData);
internshipRouter.route('/status/download').get(internshipController.downloadInternshipStatusData);
internshipRouter.route('/application/status').post(internshipController.updateInternshipStatuses);
internshipRouter.route('/applications/:ids').delete(internshipController.deleteInternshipApplications);

internshipRouter.route('/assessment/proposals').get(internshipController.getInternshipAssessmentData);
internshipRouter.route('/assessment/proposals/download').get(internshipController.downloadInternshipAssessmentData);
internshipRouter.route('/assessment/remark/:id').put(internshipController.updateInternshipRemark);
internshipRouter.route('/assessment/gradeormarks/:id').put(internshipController.updateGradeOrMark);


internshipRouter.route('/filtersdata').get(internshipController.getCompanyFiltersData);




/* module.exports = function (router) {
    
    ///internship/proposals
    router.get('/internship/company/proposals', internshipController.getInternshipProposals);
    router.post('/internship/company/proposals', internshipController.saveNewInternshipProposal);
    router.put('/internship/company/proposals', internshipController.updateInternshipProposal);
    router.delete('/internship/company/proposals/:ids', internshipController.deleteInternshipProposals);


    //router.get('/internship/applications/company/status', 
    router.get('/internship/company/status', internshipController.getInternshipStatusData);
    //router.post('/internship/applications/company/status'
    router.post('/internship/company/application/status', internshipController.updateInternshipStatuses);
    //router.delete('/internship/applications/:ids',
    router.delete('/internship/company/applications/:ids', internshipController.deleteInternshipApplications)

    ///internship/applications/company/assessment
    router.get('/internship/company/assessment/proposals', internshipController.getInternshipAssessmentData);
    //router.post('/internship/applications/company/assessment/remark'
    router.post('/internship/company/assessment/remark', internshipController.updateInternshipRemark);
    //router.post('/internship/applications/company/assessment/gradeormarks', 
    router.post('/internship/company/assessment/gradeormarks', internshipController.updateGradeOrMark);
    

} */