
import { Counselor } from "../../models/counselor.model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      Counselor?: typeof Counselor.prototype;
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload;
    const counselorId = decoded.counselorId || decoded.userId; 
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const loggedInCounselor = await Counselor.findById(counselorId).select("-password");
    if (!loggedInCounselor) {
      return res.status(401).json({ message: "Unauthorized - Counselor Not Found" });
    }
    req.Counselor = loggedInCounselor;
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Token Expired or Invalid" });
  }
};
