const express = require("express");
const app = express();
const main = require("./config/db");
require("dotenv").config({
  path: "C:/Users/rehan/OneDrive/เอกสาร/Desktop/project/Day1/.env",
});
const redisClient = require("./config/redis");
const validate = require("./utils/validator");
const cookieParser = require("cookie-parser"); // ✅ import as cookieParser
const authRouter = require("./routes/userAuth");
const problemrouter = require("./routes/problemcreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // frontend ka URL
  credentials: true,               // allow cookies
}));

app.use(express.json());
app.use(cookieParser()); // ✅ use cookieParser()
app.use("/user", authRouter);
app.use("/problem", problemrouter);
app.use("/submission", submitRouter);
app.use("/ai",aiRouter);

const Initalizeconnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB connected");
    app.listen(process.env.PORT, () => {
      console.log("Server listening at port :-" + process.env.PORT);
    });
  } catch (error) {
    console.log(error.message);
  }
};
Initalizeconnection();
