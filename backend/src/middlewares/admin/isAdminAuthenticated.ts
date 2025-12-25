import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AdminModel  from "../../models/admin/admin.model";

declare global {
  namespace Express {
    interface Request {
      admin?: typeof AdminModel.prototype;
    }
  }
}

export const isAdminAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret
    ) as jwt.JwtPayload;

    const adminEmail = decoded.email;
    if (!adminEmail) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const admin = await AdminModel.findOne({ email: adminEmail }).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized - Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};

