"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User_1 = __importDefault(require("../models/User"));
const checkAuthorization = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ msg: "Access denied" });
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err)
            return res.status(401).json({ msg: "Access denied" });
        const { _id } = payload;
        User_1.default.findOne({ _id })
            .select("-password")
            .then((user) => {
            req.user = user;
            next();
        })
            .catch(err => res.status(400).json({ msg: "Error authorizing user", err }));
    });
};
exports.default = checkAuthorization;
