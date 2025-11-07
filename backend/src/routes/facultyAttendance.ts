import express from "express";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import AttendanceSession from "../models/AttendanceSession";
import AttendanceRecord from "../models/AttendanceRecord";
import { verifyQRToken } from "../utils/qrToken";

const router = express.Router();

// 🎯 Create attendance session (faculty)
router.post("/create-session", authenticate, requireRole("Faculty"), async (req, res) => {
  try {
    const facultyId = (req.user as any)._id;
    const { course } = req.body;
    if (!course) return res.status(400).json({ message: "Course required" });

    const qrToken = generateQRToken({ facultyId, course });
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const session = await AttendanceSession.create({
      faculty: facultyId,
      course,
      qrToken,
      expiresAt,
    });

    res.json({
      message: "QR session created",
      session: {
        id: session._id,
        course,
        qrToken,
        expiresAt,
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Error creating session" });
  }
});

// 🧾 Get attendance records for a course
router.get("/records/:course", authenticate, requireRole("Faculty"), async (req, res) => {
  try {
    const { course } = req.params;
    const records = await AttendanceRecord.find({ course }).populate("student", "name email");
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching records" });
  }
});

export default router;
