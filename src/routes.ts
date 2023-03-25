import { Router } from 'express';

import { ProductRoutes } from './routes/product';
import { UserRouter } from './routes/user';

const routes = Router();

routes.use('/user', UserRouter);
routes.use('/product', ProductRoutes);

export { routes as AppRoutes };
