"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop = exports.registerScore = void 0;
const User_1 = __importDefault(require("../models/User"));
const registerScore = ({ score, difficulty, user }) => __awaiter(void 0, void 0, void 0, function* () {
    const { scores } = user;
    let updatedUser;
    const date = new Date();
    const newScores = scores[difficulty].scores;
    newScores.push({
        score,
        date: date.toDateString(),
    });
    if (score > scores[difficulty].highScore) {
        updatedUser = {
            scores: Object.assign(Object.assign({}, scores), { [difficulty]: {
                    highScore: score,
                    scores: newScores,
                } })
        };
    }
    else {
        updatedUser = {
            scores: Object.assign(Object.assign({}, scores), { [difficulty]: Object.assign(Object.assign({}, scores[difficulty]), { scores: newScores }) })
        };
    }
    let response = {
        user: null,
        status: false,
    };
    try {
        const scoreResponse = yield User_1.default.findOneAndUpdate({ _id: user._id }, { $set: updatedUser }, { new: true, reValidators: true });
        response = {
            user: scoreResponse,
            status: true,
        };
    }
    catch (err) {
        console.log(err);
        response = {
            user,
            status: false,
        };
    }
    return response;
});
exports.registerScore = registerScore;
const getTop = ({ difficulty, number }) => __awaiter(void 0, void 0, void 0, function* () {
    let response = {
        status: false,
        data: [],
    };
    try {
        const users = yield User_1.default.find({ [`scores.${difficulty}.highScore`]: { $ne: 0 } })
            .select("-password")
            .sort({ [`scores.${difficulty}.highScore`]: -1 })
            .limit(number);
        response = {
            status: true,
            data: users,
        };
    }
    catch (err) {
        response = {
            status: false,
            data: [],
        };
    }
    return response;
});
exports.getTop = getTop;
