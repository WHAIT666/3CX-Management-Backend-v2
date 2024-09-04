import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { AuthenticatedRequest } from "../controllers/auth.controller";

export const requireRole = (role: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req.userId);
            if (!user || user.role !== role) {
                return res.status(403).json({ success: false, message: "Forbidden - You do not have the required role" });
            }
            next();
        } catch (error) {
            console.error("Error in requireRole middleware", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    };
};
