import express from "express";
import {
  getDistricts,
  getMandals,
  getVillagesByMandal,
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/districts", getDistricts);
router.get("/mandals", getMandals);
router.get("/mandals/:district", getMandals);
router.get("/villages/:mandal", getVillagesByMandal);

export default router;
