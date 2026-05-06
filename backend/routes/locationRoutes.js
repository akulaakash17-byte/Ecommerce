import express from "express";
import data from "../data/locationData.js";

const router = express.Router();

const sortByName = (items) => [...items].sort((a, b) => a.localeCompare(b));
const unique = (items) => [...new Set(items)];

router.get("/districts", (req, res) => {
  const districts = unique(data.map((item) => item.district));
  res.json(sortByName(districts));
});

router.get("/mandals/:district", (req, res) => {
  const mandals = unique(
    data
      .filter((item) => item.district === req.params.district)
      .map((item) => item.mandal)
  );

  res.json(sortByName(mandals));
});

router.get("/villages", (req, res) => {
  const { district, mandal } = req.query;

  if (!district || !mandal) {
    return res.status(400).json({ message: "District and mandal are required." });
  }

  const villages = unique(
    data
      .filter((item) => item.district === district && item.mandal === mandal)
      .map((item) => item.village)
  );

  return res.json(sortByName(villages));
});

router.get("/villages/:mandal", (req, res) => {
  const villages = unique(
    data
      .filter((item) => item.mandal === req.params.mandal)
      .map((item) => item.village)
  );

  res.json(sortByName(villages));
});

export default router;
