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
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const User_1 = __importDefault(require("../models/User"));
const helper_1 = require("../utils/helper");
const checkAuthorization_1 = __importDefault(require("../middleware/checkAuthorization"));
const user = (0, express_1.Router)();
user.post("/signup", (req, res) => {
    const { firstName, lastName, email, password, score, difficulty } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ msg: "Please fill in all the fields" });
    }
    User_1.default.findOne({ email })
        .then((savedUser) => {
        if (savedUser)
            return res
                .status(422)
                .json({ msg: "User already exists with that email" });
        bcrypt
            .hash(password, 12)
            .then((hashedPassword) => {
            const scores = {
                easy: {
                    highScore: 0,
                    scores: [],
                },
                medium: {
                    highScore: 0,
                    scores: [],
                },
                hard: {
                    highScore: 0,
                    scores: [],
                },
            };
            const newUser = new User_1.default({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                scores,
            });
            newUser
                .save()
                .then((user) => __awaiter(void 0, void 0, void 0, function* () {
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "730h" });
                if (!score || score <= 0) {
                    return res
                        .status(200)
                        .json({ msg: "User signed up", user, token });
                }
                if (!difficulty)
                    return res
                        .status(400)
                        .json({ msg: "Difficulty not specified", token });
                const updateScore = yield (0, helper_1.registerScore)({
                    score,
                    difficulty,
                    user,
                });
                if (!updateScore.status)
                    return res
                        .status(400)
                        .json({
                        msg: "Error in registering score",
                        user: updateScore.user,
                        token,
                    });
                return res
                    .status(200)
                    .json({
                    msg: "User signed up and score registered",
                    user,
                    token,
                });
            }))
                .catch((err) => res
                .status(400)
                .json({ msg: "Error encountered while signing you up1", err }));
        })
            .catch((err) => res
            .status(400)
            .json({ msg: "Error encountered while signing you up2", err }));
    })
        .catch((err) => res
        .status(400)
        .json({ msg: "Error encountered while signing you up3", err }));
});
user.post("/login", (req, res) => {
    const { email, password, score, difficulty } = req.body;
    User_1.default.findOne({ email })
        .then((user) => {
        if (!user)
            return res.status(401).json({ msg: "Invalid email or password" });
        bcrypt
            .compare(password, user.password)
            .then((doMatch) => __awaiter(void 0, void 0, void 0, function* () {
            if (!doMatch)
                return res.status(401).json({ msg: "Invalid email or password" });
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "730h",
            });
            if (!score || score <= 0) {
                return res.status(200).json({ msg: "User signed up", user, token });
            }
            if (!difficulty)
                return res
                    .status(400)
                    .json({ msg: "Difficulty not specified", token });
            const updateScore = yield (0, helper_1.registerScore)({ score, difficulty, user });
            if (!updateScore.status)
                return res
                    .status(400)
                    .json({ msg: "Error in registering score", token });
            return res
                .status(200)
                .json({
                msg: "User signed up and score registered",
                user: updateScore.user,
                token,
            });
        }))
            .catch((err) => res
            .status(400)
            .json({ msg: "Error encountered while signing you in", err }));
    })
        .catch((err) => res
        .status(400)
        .json({ msg: "Error encountered while signing you in", err }));
});
user.put("/registerScore", checkAuthorization_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { score, difficulty } = req.body;
    const { user } = req;
    const newScore = yield (0, helper_1.registerScore)({ score, difficulty, user });
    if (!newScore.status)
        return res.status(400).json({ msg: "Error registering score" });
    return res
        .status(200)
        .json({ msg: "Score registered", user: newScore.user });
}));
user.get("/checkToken", checkAuthorization_1.default, (req, res) => {
    if (!req.user) {
        res.status(401).json({ msg: "User unauthorized" });
    }
    return res.status(200).json({ msg: "User authorized", user: req.user });
});
user.delete("/all", (req, res) => {
    User_1.default.deleteMany({})
        .then(() => res.status(200).json({ msg: "Deleted successfully" }))
        .catch((err) => res.status(400).json({ msg: err }));
});
exports.default = user;
