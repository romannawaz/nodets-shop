import { Router } from 'express';
import { CartController } from '../controllers/cart';
import { isAuthenticated } from '../middleware/auth';

const routes = Router();

routes.post('/:productId', isAuthenticated, CartController.add);
routes.get('/', isAuthenticated, CartController.readByUserId);
routes.patch('/:productId', isAuthenticated, CartController.removeProduct);
routes.delete('/', isAuthenticated, CartController.clear);

export { routes as CartRoutes };
