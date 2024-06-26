import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).send("Access Forbidden: User is not logged in.");

  }

  return next();
};

export default requireUser;