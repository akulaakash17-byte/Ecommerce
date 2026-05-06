import express from "express";
import cors from "cors";
import locationRoutes from "./routes/locationRoutes.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/api/location", locationRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
