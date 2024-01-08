import { Router } from "express";
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

import User from "../models/User";
import { registerScore } from "../utils/helper";
import checkAuthorization, { AuthenticatedRequest } from "../middleware/checkAuthorization";

const user = Router();

user.post("/signup", (req, res) => {
    const { firstName, lastName, email, password, score, difficulty } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ msg: "Please fill in all the fields" });
    }

    User.findOne({ email })
    .then((savedUser: any) => {
        if(savedUser) return res.status(422).json({ msg: "User already exists with that email" });
        
        bcrypt.hash(password, 12)
        .then((hashedPassword: string) => {
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
            }
            const newUser = new User({
                firstName, lastName, email, password: hashedPassword, scores,
            });
    
            newUser.save()
            .then(async (user) => {
                const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: "24h" });

                if (!score) {
                    return res.status(200).json({ msg: "User signed up", user, token });
                }
    
                if (!difficulty) return res.status(400).json({ msg: "Difficulty not specified", token });
                const updateScore = await registerScore({ score, difficulty, user });
                
                if (!updateScore.status) return res.status(400).json({ msg: "Error in registering score", user: updateScore.user, token });
    
                return res.status(200).json({ msg: "User signed up and score registered", user, token });
            })
            .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you up1", err }));
        })
        .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you up2", err }));
    })
    .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you up3", err }));

});

user.post("/login", (req: AuthenticatedRequest, res) => {
    const { email, password, score, difficulty } = req.body;

    User.findOne({ email })
    .then(user => {
        if (!user) return res.status(401).json({ msg: "Invalid email or password"});

        bcrypt.compare(password, user.password)
        .then(async (doMatch: boolean) => {
            if (!doMatch) return res.status(401).json({ msg: "Invalid email or password"});
            
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: "24h" });

            if (!score) {
                return res.status(200).json({ msg: "User signed up", user, token });
            }

            if (!difficulty) return res.status(400).json({ msg: "Difficulty not specified", token });
            const updateScore = await registerScore({ score, difficulty, user });
            
            if (!updateScore.status) return res.status(400).json({ msg: "Error in registering score", token });

            return res.status(200).json({ msg: "User signed up and score registered", user: updateScore.user, token });

        })
        .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you in", err }));
    })
    .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you in", err }));
});

user.post("/scoreboard", checkAuthorization, (req: AuthenticatedRequest, res) => {
    const { number, difficulty } = req.body;
    const { user } = req;
    const score = user?.scores[difficulty].highScore;

    User.countDocuments({ [`scores.${difficulty}.highScore`]: { $gt: score }, _id: {$ne: user?._id} })
    .then(result => {
        User.find({ [`scores.${difficulty}.highScore`]: { $gt: score }, _id: {$ne: user?._id} })
        .select("-password")
        .sort({ [`scores.${difficulty}.highScore`]: -1 })
        .limit(number)
        .then((gtScores) => {
            
            User.find({ [`scores.${difficulty}.highScore`]: { $lte: score }, _id: {$ne: user?._id} })
            .select("-password")
            .sort({ [`scores.${difficulty}.highScore`]: -1 })
            .limit(number + (number - gtScores.length))
            .then(lteScores => {
                
                return res.status(200).json({ scoreboard: [...gtScores, user, ...lteScores], position: result+1 });
            })
            .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }))
    
        })
        .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }))
    })
    .catch(() => {
        res.status(400).json({ msg: "Error getting scoreboard" })
    })

});

user.put("/registerScore", checkAuthorization, async (req: AuthenticatedRequest, res) => {
    const { score, difficulty } = req.body;

    const { user } = req;
    const newScore = await registerScore({ score, difficulty, user });

    if (!newScore.status) return res.status(400).json({ msg: "Error registering score" });
    return res.status(200).json({ msg: "Score registered", user: newScore.user });
})

user.get("/checkToken", checkAuthorization, (req: AuthenticatedRequest, res) => {
    
    if (!req.user) {
        res.status(401).json({ msg: "User unauthorized" });
    }
    
    return res.status(200).json({ msg: "User authorized", user: req.user });
})

export default user;