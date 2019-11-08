import { Router } from 'express';
const moviesController = require('./movies.controller');

export const moviesRouter = Router();


moviesRouter.route('/').get(moviesController.getMovies);
moviesRouter.route('/').post(moviesController.addMovie);

