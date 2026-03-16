const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controllers/leaderboardController");
// const auth = require("../middleware/usermiddel"); // jo bhi tera auth middleware hai

router.get("/leaderboard",  getLeaderboard);

module.exports = router;
