import { Router } from "express";
import { UserController } from "../controllers/user";

// Middleware
import { isAuthenticated } from "../middleware/auth";
import { dtoValidationMiddleware } from "../middleware/dtoValidation";

// Dto
import { UserSignInDto, UserSignUpDto } from "../dto/user";

const routes = Router();

routes.post(
  "/login",
  dtoValidationMiddleware(UserSignInDto),
  UserController.login
);
routes.post("/logout", isAuthenticated, UserController.logout);
routes.post(
  "/register",
  dtoValidationMiddleware(UserSignUpDto),
  UserController.register
);
routes.get("/:id", isAuthenticated, UserController.readById);
routes.patch("/:id", UserController.updateById);
routes.delete("/:id", UserController.deleteById);

export { routes as UserRouter };
