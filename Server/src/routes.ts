import {  Router } from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController'

const routes = Router();

const pointsController = new PointsController()
const itemsController = new ItemsController() 

routes.post('/points', pointsController.create);
routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);


// index, show, create, update, delete

export default routes;