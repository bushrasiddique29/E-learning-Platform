import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({ message: "Please Login" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);
    req.user = await User.findById(decodedData._id);

    if (!req.user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    console.log("Token:", token);
    console.log("Decoded:", decodedData);
    console.log("User:", req.user);
    next();
  } catch (error) {
  return res.status(500).json({ message: "Login First" });
  }
};

//checking admin
export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "You are not admin",
      });

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
