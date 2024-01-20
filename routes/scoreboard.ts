import { Router } from "express";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

import User from "../models/User";
import checkAuthorization, {
  AuthenticatedRequest,
} from "../middleware/checkAuthorization";
import { getTop } from "../utils/helper";

const scoreboard = Router();

scoreboard.get(
  "/myPos",
  checkAuthorization,
  async (req: AuthenticatedRequest, res) => {
    const { difficulty } = req.query;
    const queryNumber = req.query.number;
    const number = parseInt(`${queryNumber}`);
    const { user } = req;

    const score = user?.scores[`${difficulty}`].highScore;

    if (score === 0) {
      const users: any = await getTop({
        difficulty: `${difficulty}`,
        number: 5,
      });

      return res.status(200).json({ scoreboard: users.data, position: 0 });
    }

    User.countDocuments({
      [`scores.${difficulty}.highScore`]: { $gt: score },
      _id: { $ne: user?._id },
    })
      .then((result) => {
        User.find({
          $and: [
            { [`scores.${difficulty}.highScore`]: { $gt: score, $ne: 0 } },
            { _id: { $ne: user?._id } },
          ],
        })
          .select("-password")
          .sort({ [`scores.${difficulty}.highScore`]: 1 })
          .limit(number)
          .then((gtScores) => {
            User.find({
              $and: [
                { [`scores.${difficulty}.highScore`]: { $lte: score, $ne: 0 } },
                { _id: { $ne: user?._id } },
              ],
            })
              .select("-password")
              .sort({ [`scores.${difficulty}.highScore`]: -1 })
              .limit(number + (number - gtScores.length))
              .then((lteScores) => {
                if (user?.scores[`${difficulty}`].highScore <= 0) {
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
              .catch(() =>
                res.status(400).json({ msg: "Error getting scoreboard" }),
              );
          })
          .catch(() =>
            res.status(400).json({ msg: "Error getting scoreboard" }),
          );
      })
      .catch(() => {
        return res.status(400).json({ msg: "Error getting scoreboard" });
      });
  },
);
type req = {
  number: number;
  difficulty: string;
};
scoreboard.get("/top", async (req, res) => {
  const { difficulty, number } = req.query;

  if (typeof number !== "string") return;

  const response = await getTop({
    difficulty: `${difficulty}`,
    number: parseInt(number),
  });

  if (response.status) {
    return res.status(200).json({ scoreboard: response.data });
  } else {
    return res.status(400).json({ msg: "Error getting scoreboard" });
  }
});

scoreboard.get("/all", (req, res) => {
  const { difficulty } = req.query;

  User.find({ [`scores.${difficulty}.highScore`]: { $ne: 0 } })
    .select("-password")
    .sort({ [`scores.${difficulty}.highScore`]: -1 })
    .then((users) => {
      return res.status(200).json({ scoreboard: users });
    })
    .catch(() => {
      return res.status(400).json({ msg: "Error getting scoreboard" });
    });
});

export default scoreboard;
