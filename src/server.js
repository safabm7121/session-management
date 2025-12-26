import express from "express";
import { Config } from "./config/configService.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => res.json({ status: "ok" }));

app.listen(Config.port, () => {
  console.log(`Server running on port ${Config.port}`);
});
