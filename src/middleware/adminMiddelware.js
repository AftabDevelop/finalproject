const jwt = require("jsonwebtoken");
const user = require("../models/user");
const redisClient = require("../config/redis"); // make sure correct import
require("dotenv").config();

const adminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token doesn't exist");
    }

    // Verify JWT (agar invalid hai to ye hi error throw karega)
    const payload = jwt.verify(token, process.env.KEY);

    const { _id } = payload;
    if (!_id) {
      throw new Error("Id is missing");
    }

    //DB me user check karte hain
    const result = await user.findById(_id);
    if(payload.role!='admin'){
        throw new Error("Invalid Token");
    }
    if (!result) {
      throw new Error("Admin doesn't exist");
    }

    // Redis check
    const blocked = await redisClient.exists(`token:${token}`);
    if (blocked) {
      throw new Error("Invalid token");
    }

    req.result = result;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    res.status(401).send({ error: error.message });
  }
};

module.exports = adminMiddleware;
