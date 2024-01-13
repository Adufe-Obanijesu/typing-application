"use strict";
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
const scoreboard = (0, express_1.Router)();
scoreboard.post("/myPos", checkAuthorization_1.default, (req, res) => {
    const { number, difficulty } = req.body;
    const { user } = req;
    const score = user === null || user === void 0 ? void 0 : user.scores[difficulty].highScore;
    User_1.default.countDocuments({ [`scores.${difficulty}.highScore`]: { $gt: score }, _id: { $ne: user === null || user === void 0 ? void 0 : user._id } })
        .then(result => {
        User_1.default.find({ $and: [{ [`scores.${difficulty}.highScore`]: { $gt: score, $ne: 0 } }, { _id: { $ne: user === null || user === void 0 ? void 0 : user._id } }] })
            .select("-password")
            .sort({ [`scores.${difficulty}.highScore`]: 1 })
            .limit(number)
            .then((gtScores) => {
            User_1.default.find({ $and: [{ [`scores.${difficulty}.highScore`]: { $lte: score, $ne: 0 } }, { _id: { $ne: user === null || user === void 0 ? void 0 : user._id } }] })
                .select("-password")
                .sort({ [`scores.${difficulty}.highScore`]: -1 })
                .limit(number + (number - gtScores.length))
                .then(lteScores => {
                if ((user === null || user === void 0 ? void 0 : user.scores[difficulty].highScore) <= 0) {
                    return res.status(200).json({ scoreboard: [...gtScores.reverse(), ...lteScores], position: result + 1 });
                }
                return res.status(200).json({ scoreboard: [...gtScores.reverse(), user, ...lteScores], position: result + 1 });
            })
                .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }));
        })
            .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }));
    })
        .catch(() => {
        res.status(400).json({ msg: "Error getting scoreboard" });
    });
});
scoreboard.post("/top10", checkAuthorization_1.default, (req, res) => {
    const { difficulty } = req.body;
    const number = 10;
    User_1.default.find({ [`scores.${difficulty}.highScore`]: { $ne: 0 } })
        .select("-password")
        .sort({ [`scores.${difficulty}.highScore`]: -1 })
        .limit(number)
        .then((users) => {
        return res.status(200).json({ scoreboard: users });
    })
        .catch(() => {
        res.status(400).json({ msg: "Error getting scoreboard" });
    });
});
scoreboard.post("/all", checkAuthorization_1.default, (req, res) => {
    const { difficulty } = req.body;
    User_1.default.find({ [`scores.${difficulty}.highScore`]: { $ne: 0 } })
        .select("-password")
        .sort({ [`scores.${difficulty}.highScore`]: -1 })
        .then((users) => {
        return res.status(200).json({ scoreboard: users });
    })
        .catch(() => {
        res.status(400).json({ msg: "Error getting scoreboard" });
    });
});
exports.default = scoreboard;
