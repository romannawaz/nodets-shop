import { Router } from "express";
import { ProductController } from "../controllers/product";

// Middleware
import { dtoValidationMiddleware } from "../middleware/dtoValidation";

// Dto
import { CreateProductDto } from "../dto/product";

const routes = Router();

routes.post(
  "/",
  dtoValidationMiddleware(CreateProductDto),
  ProductController.create
);
routes.get("/:id", ProductController.readById);
routes.patch("/:id", ProductController.updateById);
routes.delete("/:id", ProductController.deleteById);

export { routes as ProductRoutes };
