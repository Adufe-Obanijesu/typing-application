"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors = require("cors");
// importing routes
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const scoreboard_1 = __importDefault(require("./routes/scoreboard"));
const app = (0, express_1.default)();
app.use(cors());
app.use(body_parser_1.default.json());
// routes
app.use("/user", user_1.default);
app.use("/scoreboard", scoreboard_1.default);
// connecting to database
mongoose_1.default
    .connect("mongodb+srv://Obanijesu:Bdognom123!@cluster0.nzjrd6x.mongodb.net/typing")
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server has started at port ${port}`));
