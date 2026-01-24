const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddelware");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblems,
  solvedAllProblemsByUser,
  submittedProblem
} = require("../controllers/userProblem");
const usermiddelware = require("../middleware/usermiddel");
const generateTestCases = require("../controllers/generateTestCases");


// Create → admin middleware rakh (protected)
problemRouter.post("/create", adminMiddleware, createProblem);

// NEW: AI test case generator (sirf logged-in user ya public, jo tu chahe)
problemRouter.post("/generate-testcases", usermiddelware, generateTestCases);
// agar bina auth chahiye to: problemRouter.post("/generate-testcases", generateTestCases);

// Update
problemRouter.put("/update/:id", adminMiddleware, updateProblem);

// Delete
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/ProblemById/:id", usermiddelware, getProblemById);
problemRouter.get("/getAllProblem", usermiddelware, getAllProblems);
problemRouter.get("/problemSolvedByUser", usermiddelware, solvedAllProblemsByUser);
problemRouter.get("/submittedProblem/:pid", usermiddelware, submittedProblem);

module.exports = problemRouter;
