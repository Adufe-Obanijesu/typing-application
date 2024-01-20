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
const express_1 = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const User_1 = __importDefault(require("../models/User"));
const checkAuthorization_1 = __importDefault(require("../middleware/checkAuthorization"));
const helper_1 = require("../utils/helper");
const scoreboard = (0, express_1.Router)();
scoreboard.get("/myPos", checkAuthorization_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { difficulty } = req.query;
    const queryNumber = req.query.number;
    const number = parseInt(`${queryNumber}`);
    const { user } = req;
    const score = user === null || user === void 0 ? void 0 : user.scores[`${difficulty}`].highScore;
    if (score == 0) {
        const users = yield (0, helper_1.getTop)({
            difficulty: `${difficulty}`,
            number: 5,
        });
        return res.status(200).json({ scoreboard: users.data, position: 0 });
    }
    User_1.default.countDocuments({
        [`scores.${difficulty}.highScore`]: { $gt: score },
        _id: { $ne: user === null || user === void 0 ? void 0 : user._id },
    })
        .then((result) => {
        User_1.default.find({
            $and: [
                { [`scores.${difficulty}.highScore`]: { $gt: score, $ne: 0 } },
                { _id: { $ne: user === null || user === void 0 ? void 0 : user._id } },
            ],
        })
            .select("-password")
            .sort({ [`scores.${difficulty}.highScore`]: 1 })
            .limit(number)
            .then((gtScores) => {
            User_1.default.find({
                $and: [
                    { [`scores.${difficulty}.highScore`]: { $lte: score, $ne: 0 } },
                    { _id: { $ne: user === null || user === void 0 ? void 0 : user._id } },
                ],
            })
                .select("-password")
                .sort({ [`scores.${difficulty}.highScore`]: -1 })
                .limit(number + (number - gtScores.length))
                .then((lteScores) => {
                if ((user === null || user === void 0 ? void 0 : user.scores[`${difficulty}`].highScore) <= 0) {
                    return res
                        .status(200)
                        .json({
                        scoreboard: [...gtScores.reverse(), ...lteScores],
                        position: result + 1,
                    });
                }
                return res
                    .status(200)
                    .json({
                    scoreboard: [...gtScores.reverse(), user, ...lteScores],
                    position: result + 1,
                });
            })
                .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }));
        })
            .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }));
    })
        .catch(() => {
        return res.status(400).json({ msg: "Error getting scoreboard" });
    });
}));
scoreboard.get("/top", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { difficulty, number } = req.query;
    if (typeof number !== "string")
        return;
    const response = yield (0, helper_1.getTop)({
        difficulty: `${difficulty}`,
        number: parseInt(number),
    });
    if (response.status) {
        return res.status(200).json({ scoreboard: response.data });
    }
    else {
        return res.status(400).json({ msg: "Error getting scoreboard" });
    }
}));
scoreboard.get("/all", (req, res) => {
    const { difficulty } = req.query;
    User_1.default.find({ [`scores.${difficulty}.highScore`]: { $ne: 0 } })
        .select("-password")
        .sort({ [`scores.${difficulty}.highScore`]: -1 })
        .then((users) => {
        return res.status(200).json({ scoreboard: users });
    })
        .catch(() => {
        return res.status(400).json({ msg: "Error getting scoreboard" });
    });
});
exports.default = scoreboard;
