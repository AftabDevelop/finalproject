const express = require('express');
const submitRouter = express.Router();
const usermiddel = require('../middleware/usermiddel');
const {submitCode,runCode} = require('../controllers/userSubmission');

submitRouter.post("/submit/:id",usermiddel,submitCode);
submitRouter.post("/run/:id",usermiddel,runCode)

module.exports = submitRouter;