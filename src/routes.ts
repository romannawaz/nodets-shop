import { Router } from 'express';
import { UserRouter } from './routes/user';

const routes = Router();

routes.use('/user', UserRouter);

export { routes as AppRoutes };
