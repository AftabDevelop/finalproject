const User = require("../models/user");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const submission = require("../models/submission");

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      // Get language ID
      const languageId = getLanguageById(language);

      // Create batch submissions
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      // Submit batch (await asynchronous call)
      const submitResult = await submitBatch(submissions);

      // Collect tokens for result fetching
      const resultTokens = submitResult.map((value) => value.token);

      // Fetch results (await asynchronous call)
      const testResults = await submitToken(resultTokens);

      // Check all test results for success status_id === 3
      for (const test of testResults) {
        console.log("Test status:", test.status_id, test.status);
        if (test.status_id !== 3) {
          return res
            .status(400)
            .send(
              `Error Occurred: Test failed with status ${test.status.description}`
            );
        }
      }
    }

    // Save problem to database
    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    res.status(201).send("Problem Saved Successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const updateProblem = async (req, res) => {
  console.log("Update request received:", req.params.id); // ✅ add kar
  
  const { id } = req.params;
  
  try {
    // console.log("ID valid:", id); // ✅ add kar
    
    if (!id) {
      return res.status(400).send("Invalid ID");
    }
    
    // console.log("Finding problem with ID:", id); // ✅ add kar
    const DsaProblem = await Problem.findById(id);
    // console.log("Problem found:", DsaProblem ? "Yes" : "No"); // ✅ add kar
    
    if (!DsaProblem) {
      return res.status(404).send("ID is not present");
    }

    // console.log("Updating problem..."); // ✅ add kar
    const newProblem = await Problem.findByIdAndUpdate(
      id, 
      { ...req.body }, 
      { runValidators: true, new: true }
    );
    
    // console.log("Update successful:", newProblem); // ✅ add kar
    res.status(200).send(newProblem);
  } catch (error) {
    console.log("🚨 UPDATE ERROR:", error.message); // ✅ ye important
    console.log("Full error:", error); // ✅ full stack trace
    res.status(500).send("Err :- " + error.message);
  }
};

const deleteProblem = async(req,res)=>{

  const {id} = req.params;
  try {
    if(!id){
      return res.status(400).send("ID is missing");
    }
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if(!deletedProblem){
      return res.status(404).send("Problem is missing");
    }
    res.status(200).send("DeletedProblem Sucessfully");
  } catch (error) {
    res.status(404).send("Err :- " + error.message);
  }
};

const getProblemById = async(req,res)=>{
  const {id} = req.params;
  try {
    if(!id){
      return res.status(400).send("ID is missing");
    }
    const getProlem = await Problem.findById(id).select('title description difficulty tags visibleTestCases startCode');
    if(!getProlem){
      return res.status(404).send("Problem is missing")
    }
    res.status(200).send(getProlem);
  } catch (error) {
    res.status(404).send("Err :- " + error.message);
  }
};

const getAllProblems = async(req,res)=>{
   try {
    const getProlem = await Problem.find({}).select('_id title difficulty tags');
    if(getProlem.length==0){
      return res.status(404).send("Problem is missing")
    }
    res.status(200).send(getProlem);
  } catch (error) {
    res.status(404).send("Err :- " + error.message);
  }
};

const solvedAllProblemsByUser = async(req,res)=>{
  
  try {
    const userId = req.result._id;
    // const count = req.result.problemSolved.length;
    const user = await User.findById(userId).populate({
      path:"problemSolved",
      select:"_id tittle difficulty tags"
    });
    res.status(200).send(user.problemSolved);
  } catch (error) {
    res.status(500).send("Err :- ");
  }
   
};

const submittedProblem = async(req,res)=>{
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;
    const ans = await submission.find({userId,problemId});
    if(ans.length==0){
      res.status(200).send("No submission");
    }
    res.status(200).send(ans);

  } catch (error) {
    res.status(500).send("Err :- " + error.message);
  }
}

module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedAllProblemsByUser,submittedProblem};