const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDatabase();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.info(`Serveur demarre sur le port ${PORT}`));
