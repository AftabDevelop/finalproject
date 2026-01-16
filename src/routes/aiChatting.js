const express = require('express');
const aiRouter = express.Router();
const userMiddleware = require("../middleware/usermiddel");
const solveDoubt = require("../controllers/solveDoubts");

aiRouter.post('/chat', userMiddleware, solveDoubt);

module.exports = aiRouter;
