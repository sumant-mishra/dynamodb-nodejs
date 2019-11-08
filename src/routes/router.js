import { Router } from 'express';
import { moviesRouter } from '../resources/movies/movies.router';


export const router = Router();


router.use('/movies', moviesRouter);