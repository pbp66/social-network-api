import { Router } from "express";
import apiRoutes from "./api/index.js";
const router = new Router();

router.use("/api", apiRoutes);

router.use((req, res) => res.send("Wrong Route!"));

export default router;
