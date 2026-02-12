# AI-based Online Judge with Auto Testcase Generator

An online coding platform where users can solve problems, run and submit code, and get evaluated using automatically generated hidden testcases with AI-powered explanations. The platform follows a LeetCode-style flow and uses Judge0 CE as the code execution engine.

## 🚀 Features

- User authentication (login / signup)
- Role-based access:
  - User: solve problems, run/submit code, view submission history
  - Admin: manage problems, manage testcases, monitor submissions
- Problem Management:
  - Title, description, constraints, difficulty
  - Sample testcases and hidden testcases
- Code Execution:
  - Multiple language support through Judge0 CE
  - Separate Run and Submit flow
  - Realtime status: In Queue, Processing, Accepted, Wrong Answer, Runtime Error, etc.
  - Shows runtime and memory usage
- AI Testcase Generator:
  - Generates hidden testcases from problem statement and constraints
  - Creates expected output and short explanation for each testcase
  - Focuses on edge cases and tricky scenarios
- Submissions:
  - “All test cases evaluated” summary banner with runtime and memory
  - Per-testcase result with Passed / Failed status and explanation
  - User-wise submission history

## 🧱 Tech Stack

- **Frontend:** React, Tailwind CSS / CSS Modules (adjust as per your project)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Code Execution:** Judge0 CE (via RapidAPI)
- **AI:** OpenAI / Gemini API for hidden testcase + explanation generation
- **Others:** Axios, JWT authentication, bcrypt, dotenv

## 📁 High-level Folder Structure

```bash
root
├── src
│   ├── controllers
│   │   ├── authController.js
│   │   ├── problemController.js
│   │   └── userSubmission.js
│   ├── models
│   │   ├── User.js
│   │   ├── Problem.js
│   │   └── Submission.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── problemRoutes.js
│   │   └── submissionRoutes.js
│   ├── utils
│   │   ├── problemUtility.js   # Judge0 integration, polling, AI helpers
│   │   └── aiUtility.js        # Hidden testcase + explanation generator
│   └── middleware
│       ├── authMiddleware.js
│       └── roleMiddleware.js
└── client
    └── src
        ├── pages
        ├── components
        └── hooks

⚙️ Setup & Installation
# 1. Clone the repo
git clone <your-repo-url>
cd <project-folder>

# 2. Install server dependencies
npm install

# 3. Install client dependencies
cd client
npm install


Environment Variables
Create a .env file in the server root:

PORT=5000
MONGO_URI=<your-mongodb-uri>

JWT_SECRET=<your-jwt-secret>

JUDGE0_BASE_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=<your-rapidapi-key>
JUDGE0_HOST=judge0-ce.p.rapidapi.com

AI_API_KEY=<your-ai-api-key>   # OpenAI / Gemini


Running the Project:
# Backend
npm run dev

# Frontend
cd client
npm start


🧠 How the AI Testcase Generator Works
Admin creates or updates a problem.

Backend sends the problem statement, constraints, and input/output format to the AI model.

The AI:

Generates multiple edge-case inputs

Computes the expected outputs

Produces a short explanation for each testcase

These are stored in the database as hidden testcases.

When a user submits code, results from Judge0 are checked against these hidden testcases.

🔮 Future Improvements
Support for more languages

Editorial / discussion section for each problem

Contest mode with timer and leaderboard

Analytics dashboard (problem stats, acceptance rate, user performance)

Self-hosted Judge0 instance instead of RapidAPI
