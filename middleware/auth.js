import jwt  from "jsonwebtoken";
import User from "../models/user.js";
import { JWT_SECRET } from "../consts.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "You must be logged in to do that." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded   = jwt.verify(token, JWT_SECRET);
    const foundUser = await User.findById(decoded.id).select("id userName email role");

    if (!foundUser) {
      return res.status(401).json({ message: "User not found. Please log in again." });
    }

    req.currentUser = foundUser;
    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
