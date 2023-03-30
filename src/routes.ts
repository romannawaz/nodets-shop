import { Router } from "express";
import { CartRoutes } from "./routes/cart";

import { ProductRoutes } from "./routes/product";
import { UserRouter } from "./routes/user";

const routes = Router();
// users, products, carts. We should name in plural
routes.use("/user", UserRouter);
routes.use("/product", ProductRoutes);
routes.use("/cart", CartRoutes);

export { routes as AppRoutes };
