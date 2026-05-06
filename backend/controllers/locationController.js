import locationData from "../data/locationData.js";

const sortByName = (items) => [...items].sort((a, b) => a.localeCompare(b));
const unique = (items) => [...new Set(items.filter(Boolean))];

export function getDistricts(req, res) {
  res.json(sortByName(unique(locationData.map((item) => item.district))));
}

export function getMandals(req, res) {
  const district = req.params.district || req.query.district || "Siddipet";
  const mandals = locationData
    .filter((item) => item.district === district)
    .map((item) => item.mandal);

  res.json(sortByName(unique(mandals)));
}

export function getVillagesByMandal(req, res) {
  const villages = locationData
    .filter((item) => item.mandal === req.params.mandal)
    .map((item) => item.village);

  res.json(sortByName(unique(villages)));
}
