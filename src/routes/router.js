import { Router } from 'express';
import { companyRouter } from '../resources/company/company.router';
import { studentRouter } from '../resources/student/student.router';
import { universityRouter } from '../resources/university/university.router';
import { companiesRouter } from './../resources-temp/companies/companies.router';
import { guidesRouter } from './../resources-temp/guides/guides.router';
import { studentsRouter } from './../resources-temp/students/students.router';
import { universitiesRouter } from './../resources-temp/universities/universities.router';


export const router = Router();


router.use('/company', companyRouter);
router.use('/student', studentRouter);
router.use('/university', universityRouter);
router.use('/tempcompanies', companiesRouter);
router.use('/tempguides', guidesRouter);
router.use('/tempstudents', studentsRouter);
router.use('/tempuniversities', universitiesRouter);