import express from "express";
import bodyParser from "body-parser";
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

// importing routes
import user from "./routes/user";
import mongoose from "mongoose";

import checkAuthorization from "./middleware/checkAuthorization";
import scoreboard from "./routes/scoreboard";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/user", user);
app.use("/scoreboard", scoreboard);

// connecting to database
mongoose
  .connect(
    `${process.env.MONGO_URI}`,
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server has started at port ${port}`));
