import { Router } from "express";
import { CartRoutes } from "./routes/cart";

import { ProductRoutes } from "./routes/product";
import { UserRouter } from "./routes/user";

const routes = Router();
routes.use("/users", UserRouter);
routes.use("/products", ProductRoutes);
routes.use("/carts", CartRoutes);

export { routes as AppRoutes };
