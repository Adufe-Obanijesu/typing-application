import { Router } from "express";
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

import User from "../models/User";
import { registerScore } from "../utils/helper";
import checkAuthorization, { AuthenticatedRequest } from "../middleware/login";

const user = Router();

user.post("/signup", (req, res) => {
    const { firstName, lastName, email, password, score } = req.body;

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
            .then((user) => {
                const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: "24h" });

                return res.status(200).json({ msg: "User signed up", user, token });
            })
            .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you up1", err }));
        })
        .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you up2", err }));
    })
    .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you up3", err }));

});

user.post("/signin", (req: AuthenticatedRequest, res) => {
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
            
            if (!updateScore) return res.status(400).json({ msg: "Error in regiestering score", token });

            return res.status(200).json({ msg: "User signed up and score registered", user, token });

        })
        .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you in", err }));
    })
    .catch((err: any) => res.status(400).json({ msg: "Error encountered while signing you in", err }));
});

user.get("/scoreboard", checkAuthorization, (req, res) => {
    const { number, difficulty, score } = req.body;

    let response = [];

    User.find({ [`scores.${difficulty}.highScore`]: { $lte: score } })
    .select("-password")
    .sort({ [`scores.${difficulty}.highScore`]: -1 })
    .limit(number)
    .then((lteScores) => {

        User.find({ [`scores.${difficulty}.highScore`]: { $gt: score } })
        .select("-password")
        .sort({ [`scores.${difficulty}.highScore`]: -1 })
        .limit(number + (number - lteScores.length))
        .then(gteScores => {
            return res.status(200).json({ scoreboard: [...lteScores, ...gteScores] });
        })
        .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }))

    })
    .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }))
});

export default user;