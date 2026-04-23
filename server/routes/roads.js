const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET ALL ROADS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM roads ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD ROAD
router.post("/", async (req, res) => {
  try {
    const { latitude, longitude, condition, description } = req.body;

    const result = await pool.query(
      "INSERT INTO roads (latitude, longitude, condition, description, score) VALUES ($1, $2, $3, $4, 0) RETURNING *",
      [latitude, longitude, condition, description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// VOTE
router.post("/:id/vote", async (req, res) => {
  try {
    const { vote_type } = req.body;

    const result = await pool.query(
      "UPDATE roads SET score = score + $1 WHERE id = $2 RETURNING *",
      [vote_type, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Vote failed" });
  }
});

module.exports = router;