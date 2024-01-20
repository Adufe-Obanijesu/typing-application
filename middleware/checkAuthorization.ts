import { Request, Response, NextFunction, RequestHandler } from "express";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

import User from "../models/User";

interface AuthenticatedRequest<T = Record<string, any>> extends Request {
  user?: T;
}

type ExtendedRequestHandler<T = Record<string, any>> = (
  req: AuthenticatedRequest<T>,
  res: Response,
  next: NextFunction,
) => Response<any, Record<string, any>> | undefined;

const checkAuthorization: ExtendedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ msg: "Access denied" });

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err: any, payload: any) => {
    if (err) return res.status(401).json({ msg: "Access denied" });

    const { _id } = payload;

    User.findOne({ _id })
      .select("-password")
      .then((user: any) => {
        if (!user) {
          return res.status(422).json({ msg: "User not found" });
        }

        req.user = user;
        next();
      })
      .catch((err) =>
        res.status(400).json({ msg: "Error authorizing user", err }),
      );
  });
};

export { AuthenticatedRequest };

export default checkAuthorization;
