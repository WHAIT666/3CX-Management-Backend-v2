import { Request, Response, NextFunction } from "express";
import { Roles } from "../utils/roles";

const requireRole = (role: Roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user || user.role !== role) {
      return res.status(403).send("Access forbidden: Insufficient permissions.");
    }

    next();
  };
};

export default requireRole;
