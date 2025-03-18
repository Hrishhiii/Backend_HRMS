const express = require("express");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// 🎯 Get Dashboard Data
router.get("/", authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();

    // ✅ Attendance Summary
    const totalPresent = await Attendance.countDocuments({ date: today, status: "Present" });
    const totalAbsent = await Attendance.countDocuments({ date: today, status: "Absent" });

    // ✅ Upcoming Birthdays (within 7 days)
    const upcomingBirthdays = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$dob" }, currentMonth] },
          { $gte: [{ $dayOfMonth: "$dob" }, currentDay] },
          { $lte: [{ $dayOfMonth: "$dob" }, currentDay + 7] }
        ]
      }
    }).select("name dob");

    // ✅ Work Anniversaries (within 7 days)
    const upcomingAnniversaries = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$joiningDate" }, currentMonth] },
          { $gte: [{ $dayOfMonth: "$joiningDate" }, currentDay] },
          { $lte: [{ $dayOfMonth: "$joiningDate" }, currentDay + 7] }
        ]
      }
    }).select("name joiningDate");

    res.json({
      message: "Dashboard Data Fetched Successfully",
      attendance: { totalPresent, totalAbsent },
      upcomingBirthdays,
      upcomingAnniversaries
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
