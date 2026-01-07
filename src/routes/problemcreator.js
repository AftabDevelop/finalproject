const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddelware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedAllProblemsByUser,submittedProblem} = require("../controllers/userProblem");
const usermiddelware = require("../middleware/usermiddel");

// Create → admin middleware rakh (protected)
problemRouter.post("/create", adminMiddleware, createProblem);

// Update → temporarily middleware hata diya (testing ke liye)
problemRouter.put("/update/:id", adminMiddleware,updateProblem);  // ✅ adminMiddleware hata diya

// Delete → admin middleware rakh
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/ProblemById/:id", usermiddelware, getProblemById);
problemRouter.get("/getAllProblem", usermiddelware, getAllProblems);
problemRouter.get("/problemSolvedByUser",usermiddelware,solvedAllProblemsByUser);
problemRouter.get("/submittedProblem/:pid",usermiddelware,submittedProblem);

module.exports = problemRouter;
