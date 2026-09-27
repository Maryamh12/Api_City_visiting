import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../consts.js";

/** POST /register — create a new user account */
const register = async (req, res, next) => {
  const { userName, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `Email ${email} is already registered.` });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ userName, email, password: hashedPassword });

    return res.status(201).json({
      message: `Account created for ${newUser.userName}.`,
      user: { userName: newUser.userName, email: newUser.email },
    });
  } catch (err) {
    next(err);
  }
};

/** POST /login — authenticate and return a JWT */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const payload = { id: user.id };
    const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ token, payload });
  } catch (err) {
    next(err);
  }
};

export default { register, login };
