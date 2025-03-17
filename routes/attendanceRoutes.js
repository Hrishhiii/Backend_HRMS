const express = require("express");
const { markAttendance, getAttendanceRecords } = require("../controllers/attendanceController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Mark Attendance (Protected)
router.post("/mark", authMiddleware, markAttendance);

// ✅ Get Attendance Records (Protected)
router.get("/", authMiddleware, getAttendanceRecords);

module.exports = router;
