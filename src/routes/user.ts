import { Router } from 'express';
import { UserController } from '../controllers/user';

const routes = Router();

routes.post('/', UserController.create);
routes.get('/:id', UserController.readById);
routes.patch('/:id', UserController.updateById);
routes.delete('/:id', UserController.deleteById);

export { routes as UserRouter };
