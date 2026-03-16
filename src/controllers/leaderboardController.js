const User = require("../models/user");

const getLeaderboard = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;

    const users = await User.find(
      {},
      "firstName emailId totalPoints easySolved mediumSolved hardSolved"
    )
      .sort({ totalPoints: -1, easySolved: -1, createdAt: 1 })
      .limit(limit);

    const withRank = users.map((u, idx) => ({
      rank: idx + 1,
      firstName: u.firstName,
      emailId: u.emailId,
      totalPoints: u.totalPoints,
      easySolved: u.easySolved,
      mediumSolved: u.mediumSolved,
      hardSolved: u.hardSolved,
      _id: u._id,
    }));

    res.status(200).json(withRank);
  } catch (err) {
    res.status(500).send("Internal Server Error " + err);
  }
};

module.exports = { getLeaderboard };
