import { Router } from "express";
import userRoutes from "userRoutes.js";
import reactionRoutes from "reactionRoutes.js";
import thoughtRoutes from "thoughtRoutes.js";
const router = new Router();

router.use("/users", userRoutes);
router.use("reactions", reactionRoutes);
router.use("/thoughts", thoughtRoutes);

export default router;
