import express from "express";
import data from "../data/locationData.js";

const router = express.Router();

router.get("/districts", (req, res) => {
  const districts = [...new Set(data.map(d => d.district))];
  res.json(districts);
});

router.get("/mandals/:district", (req, res) => {
  const mandals = [
    ...new Set(
      data
        .filter(d => d.district === req.params.district)
        .map(d => d.mandal)
    ),
  ];
  res.json(mandals);
});

router.get("/villages/:mandal", (req, res) => {
  const villages = data
    .filter(d => d.mandal === req.params.mandal)
    .map(d => d.village);

  res.json(villages);
});

export default router;