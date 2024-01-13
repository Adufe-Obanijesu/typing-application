import { Router } from "express";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

import User from "../models/User";
import checkAuthorization, { AuthenticatedRequest } from "../middleware/checkAuthorization";

const scoreboard = Router();

scoreboard.post("/myPos", checkAuthorization, (req: AuthenticatedRequest, res) => {
    const { number, difficulty } = req.body;
    const { user } = req;
    const score = user?.scores[difficulty].highScore;

    User.countDocuments({ [`scores.${difficulty}.highScore`]: { $gt: score }, _id: {$ne: user?._id} })
    .then(result => {
        User.find({ $and: [ {[`scores.${difficulty}.highScore`]: { $gt: score, $ne: 0 }}, {_id: {$ne: user?._id}} ] })
        .select("-password")
        .sort({ [`scores.${difficulty}.highScore`]: 1 })
        .limit(number)
        .then((gtScores) => {
            
            User.find({ $and: [ {[`scores.${difficulty}.highScore`]: { $lte: score, $ne: 0 }}, {_id: {$ne: user?._id}} ] })
            .select("-password")
            .sort({ [`scores.${difficulty}.highScore`]: -1 })
            .limit(number + (number - gtScores.length))
            .then(lteScores => {

                if (user?.scores[difficulty].highScore <= 0) {
                    return res.status(200).json({ scoreboard: [...gtScores.reverse(), ...lteScores], position: result+1 });
                }
                
                return res.status(200).json({ scoreboard: [...gtScores.reverse(), user, ...lteScores], position: result+1 });
            })
            .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }))
    
        })
        .catch(() => res.status(400).json({ msg: "Error getting scoreboard" }))
    })
    .catch(() => {
        res.status(400).json({ msg: "Error getting scoreboard" })
    })

});

scoreboard.post("/top10", checkAuthorization, (req, res) => {
    const { difficulty } = req.body;
    const number = 10;
    
    User.find({ [`scores.${difficulty}.highScore`]: {$ne: 0} })
    .select("-password")
    .sort({ [`scores.${difficulty}.highScore`]: -1 })
    .limit(number)
    .then((users) => {        
        return res.status(200).json({ scoreboard: users });    
    })
    .catch(() => {
        res.status(400).json({ msg: "Error getting scoreboard" });
    })

});

scoreboard.post("/all", checkAuthorization, (req, res) => {
    const { difficulty } = req.body;
    
    User.find({ [`scores.${difficulty}.highScore`]: {$ne: 0} })
    .select("-password")
    .sort({ [`scores.${difficulty}.highScore`]: -1 })
    .then((users) => {        
        return res.status(200).json({ scoreboard: users });    
    })
    .catch(() => {
        res.status(400).json({ msg: "Error getting scoreboard" });
    })

});

export default scoreboard;