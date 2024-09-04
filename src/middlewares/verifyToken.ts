import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../controllers/auth.controller";
import { User } from "../models/user.model";

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId).select("-password"); // Ensure 'userId' is used here
    if (!user) {
      console.log("User not found for the provided token:", decoded.userId);
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    req.userId = user._id.toString();
    res.locals.user = user;

    console.log("User attached to request:", user);

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};
