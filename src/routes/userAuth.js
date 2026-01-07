const express = require("express");
const app = express();
const authRouter = express.Router();
const {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
} = require("../controllers/userAuthent");
const usermiddelware = require("../middleware/usermiddel");
const adminMiddelware = require("../middleware/adminMiddelware");

authRouter.post("/reg", register);
authRouter.post("/login", login);
authRouter.post("/logout", usermiddelware, logout);
authRouter.post("/admin/reg", adminMiddelware, adminRegister);
authRouter.delete("/deleteprofile", usermiddelware, deleteProfile);

authRouter.get("/check", usermiddelware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role, // 👈 important
  };

  res.status(200).json({
    user: reply,
    message: "Valid user",
  });
});

module.exports = authRouter;
