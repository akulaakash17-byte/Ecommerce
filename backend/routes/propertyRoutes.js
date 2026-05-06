import express from "express";
import {
  createProperty,
  deleteProperty,
  getProperty,
  listProperties,
  updateProperty,
} from "../controllers/propertyController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { idParamRule, propertyRules } from "../middleware/validators.js";
import { uploadPropertyImages } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", listProperties);
router.get("/:idOrSlug", getProperty);
router.post("/", protect, authorizeRoles("admin", "agent"), uploadPropertyImages, propertyRules, validateRequest, createProperty);
router.put("/:id", protect, authorizeRoles("admin", "agent"), uploadPropertyImages, idParamRule, propertyRules, validateRequest, updateProperty);
router.delete("/:id", protect, authorizeRoles("admin"), idParamRule, validateRequest, deleteProperty);

export default router;
