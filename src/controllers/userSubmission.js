const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

// ============ Submit Code (Hidden Test Cases) ============
const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Some field missing");
    }

    if (language === "cpp") language = "c++";

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    const languageId = getLanguageById(language);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
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

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    // ⭐ Leaderboard points (first AC only per problem per user)
    if (status === "accepted") {
      const user = await User.findById(userId);

      if (user) {
        const alreadySolved = (user.problemSolved || []).some(
          (pid) => pid.toString() === problemId.toString()
        );

        if (!alreadySolved) {
          let pointsToAdd = 0;

          if (problem.difficulty === "easy") {
            pointsToAdd = 10;
            user.easySolved = (user.easySolved || 0) + 1;
          } else if (problem.difficulty === "medium") {
            pointsToAdd = 25;
            user.mediumSolved = (user.mediumSolved || 0) + 1;
          } else if (problem.difficulty === "hard") {
            pointsToAdd = 50;
            user.hardSolved = (user.hardSolved || 0) + 1;
          }

          user.totalPoints = (user.totalPoints || 0) + pointsToAdd;
          user.problemSolved.push(problemId);

          await user.save();
        }
      }
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

// ============ Run Code (Visible + Hidden Test Cases) ============
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

    const visibleSubmissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const hiddenSubmissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const allSubmissions = [...visibleSubmissions, ...hiddenSubmissions];

    const submitResult = await submitBatch(allSubmissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    const visibleCount = problem.visibleTestCases.length;

    const visibleResults = testResult.slice(0, visibleCount);
    const hiddenResults = testResult.slice(visibleCount);

    let runtime = 0;
    let memory = 0;
    let success = true;
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        success = false;
        if (!errorMessage) {
          errorMessage = test.stderr || test.compile_output || null;
        }
      }
    }

    const mapResult = (tests, casesFromDb) =>
      tests.map((t, idx) => {
        const orig = casesFromDb[idx] || {};
        return {
          input: orig.input,
          expected: orig.output,
          explanation: orig.explanation,
          output: (t.stdout || "").trim(),
          statusId: t.status_id,
          status: t.status && t.status.description,
        };
      });

    const visibleTests = mapResult(visibleResults, problem.visibleTestCases);
    const hiddenTests = mapResult(hiddenResults, problem.hiddenTestCases);

    return res.status(201).json({
      success,
      runtime,
      memory,
      errorMessage,
      totalVisible: problem.visibleTestCases.length,
      totalHidden: problem.hiddenTestCases.length,
      visibleTests,
      hiddenTests,
    });
  } catch (err) {
    return res.status(500).send("Internal Server Error " + err);
  }
};

module.exports = { submitCode, runCode };
