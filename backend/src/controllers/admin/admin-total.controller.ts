import { Request,Response } from "express";
import {User} from "../../models/user.model";
import {Counselor} from "../../models/counselor.model";
import Appointment from "../../models/counselor/appointment.model";

export const getAdminStats = async (req:Request, res:Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCounselors = await Counselor.countDocuments();
    const totalSessions = await Appointment.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCounselors,
        totalSessions,
      },
    });
  } catch (error:any) {
    console.error("Error fetching admin stats:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching admin stats",
    });
  }
};

export const getAdminAnalysis = async (req:Request, res:Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCounselors = await Counselor.countDocuments();
    const totalSessions = await Appointment.countDocuments();

    const lastSixMonths = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString("default", { month: "short" }),
      };
    }).reverse();

    const monthlyUsers = await Promise.all(
      lastSixMonths.map(async (m, i) => {
        const start = new Date();
        start.setMonth(start.getMonth() - (5 - i), 1);
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);
        const count = await User.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });
        return { ...m, users: count };
      })
    );

    const monthlySessions = await Promise.all(
      lastSixMonths.map(async (m, i) => {
        const start = new Date();
        start.setMonth(start.getMonth() - (5 - i), 1);
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);
        const count = await Appointment.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });
        return { ...m, sessions: count };
      })
    );

    // Counselor status breakdown
    const approved = await Counselor.countDocuments({ status: "Approved" });
    const pending = await Counselor.countDocuments({ status: "Pending" });
    const cancelled = await Counselor.countDocuments({ status: "Cancelled" });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCounselors,
        totalSessions,
        monthlyUsers,
        monthlySessions,
        counselorStatus: { approved, pending ,cancelled },
      },
    });
  } catch (error) {
    console.error("Error in admin analysis:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
