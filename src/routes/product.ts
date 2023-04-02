import { Router } from "express";
import { ProductController } from "../controllers/product";
import { CustomRequest } from "../middleware/auth";

const routes = Router();

routes.post("/", ProductController.create);
routes.get("/:id", ProductController.readById);
routes.patch("/:id", ProductController.updateById);
routes.delete("/:id", ProductController.deleteById);

export { routes as ProductRoutes };
