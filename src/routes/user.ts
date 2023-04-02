import { Router } from 'express';
import { UserController } from '../controllers/user';

// Middleware
import { isAuthenticated } from '../middleware/auth';

const routes = Router();

routes.post('/login', UserController.login);
routes.post('/logout', isAuthenticated, UserController.logout);
routes.post('/register', UserController.register);
routes.get('/refresh_token', UserController.refreshToken);
routes.get('/:id', isAuthenticated, UserController.readById);
routes.patch('/:id', UserController.updateById);
routes.delete('/:id', UserController.deleteById);


export { routes as UserRouter };
