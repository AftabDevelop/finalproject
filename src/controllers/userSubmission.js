const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

// ============ Submit Code (Hidden Test Cases) ============
const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    // Basic validation
    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Some field missing");
    }

    // Normalise language
    if (language === "cpp") language = "c++";

    // Fetch problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    // Create initial submission with pending status
    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    // Prepare Judge0 submissions (hidden test cases)
    const languageId = getLanguageById(language);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    // Send to Judge0
    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    // Aggregate results
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        if (test.status_id == 4) {
          status = "error";
          errorMessage = test.stderr || test.compile_output || null;
        } else {
          status = "wrong";
          errorMessage = test.stderr || test.compile_output || null;
        }
      }
    }

    // Update submission doc
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    // Mark problem as solved for user (only if fully accepted)
    if (status === "accepted" && !req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    const accepted = status === "accepted";

    return res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
      errorMessage,
      status,
    });
  } catch (err) {
    return res.status(500).send("Internal Server Error " + err);
  }
};

// ============ Run Code (Visible Test Cases) ============

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Some field missing");
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    if (language === "cpp") language = "c++";

    const languageId = getLanguageById(language);

    // Visible test cases only
    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let success = true;
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        success = false;
        errorMessage = test.stderr || test.compile_output || null;
      }
    }

    return res.status(201).json({
      success,
      testCasesPassed,
      totalTestCases: problem.visibleTestCases.length,
      testCases: testResult,
      runtime,
      memory,
      errorMessage,
    });
  } catch (err) {
    return res.status(500).send("Internal Server Error " + err);
  }
};

module.exports = { submitCode, runCode };
