import express from "express";
import { getDashboardOverview } from "../controllers/dashboardController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, authorizeRoles("admin", "agent"), getDashboardOverview);

export default router;
