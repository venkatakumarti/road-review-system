const express = require("express");
const cors = require("cors");

const app = express(); // ✅ MUST BE FIRST

app.use(cors());
app.use(express.json());

// ---------------- DATABASE ----------------
const pool = require("./db");

// ---------------- ROUTES ----------------
const roadRoutes = require("./routes/roads");
app.use("/api/roads", roadRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ---------------- SERVER ----------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});