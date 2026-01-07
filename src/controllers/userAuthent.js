const users = require("../models/user");
const Validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const submission = require("../models/submission");

// =============== Register ===============
const register = async (req, res) => {
  try {
    Validate(req.body);
    const { firstName, emailId, password, role } = req.body;

    // Password hash
    req.body.password = await bcrypt.hash(password, 10);

    // Frontend se aaya role respect karo, default 'user'
    const finalRole = role === "admin" ? "admin" : "user";
    req.body.role = finalRole;

    const user = await users.create(req.body);

    const token = jwt.sign(
      { _id: user._id, role: user.role, emailId },
      process.env.KEY,
      { expiresIn: 60 * 60 }
    );

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });

    res.status(201).json({
      user: reply,
      message: "Register Successfully",
    });
  } catch (error) {
    res.status(400).send("Err :- " + error.message);
  }
};

// =============== Login ===============
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) throw new Error("Invalid Credentials");

    const user = await users.findOne({ emailId });
    if (!user) throw new Error("Invalid Credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid Credentials");

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.KEY,
      { expiresIn: 60 * 60 }
    );

    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      user: reply,
      message: "Loggin Sucessfully",
    });
  } catch (error) {
    res.status(401).send("Err:- " + error.message);
  }
};

// =============== Logout ===============
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).send("Err:- Token missing");
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.KEY);
    } catch (err) {
      // Invalid token bhi block kar do
      await redisClient.set(`token:${token}`, "Blocked");
      res.cookie("token", null, { expires: new Date(Date.now()) });
      return res.send("Logout Successfully");
    }

    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout Successfully");
  } catch (error) {
    res.status(503).send("Err:- " + error.message);
  }
};

// =============== Admin Register (separate endpoint, optional) ===============
const adminRegister = async (req, res) => {
  try {
    Validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "admin";

    const user = await users.create(req.body);

    const token = jwt.sign(
      { _id: user._id, role: user.role, emailId },
      process.env.KEY,
      { expiresIn: 60 * 60 }
    );

    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });

    res.status(201).send("Admin Registered Successfully");
  } catch (error) {
    res.status(400).send("Err :- " + error.message);
  }
};

// =============== Delete Profile ===============
const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    await users.findByIdAndDelete(userId);
    await submission.deleteMany({ userId });
    res.status(200).send("Deleted user");
  } catch (error) {
    res.status(500).send("Err :- " + error.message);
  }
};

module.exports = { register, login, logout, adminRegister, deleteProfile };
