import express from "express";
import cors from "cors";
import locationRoutes from "./routes/locationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/location", locationRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});