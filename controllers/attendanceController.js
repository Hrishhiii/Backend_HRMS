const Attendance = require("../models/Attendance");

// ✅ Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    // Prevent duplicate attendance entry for the same day
    const existingRecord = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: new Date().setHours(0, 0, 0, 0) } // Check for today’s record
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    const attendance = new Attendance({
      user: req.user.id,
      status
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully", attendance });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Attendance Records (Admin or Self)
const getAttendanceRecords = async (req, res) => {
  try {
    let records;

    if (req.user.role === "Manager") {
      // Manager can view all records
      records = await Attendance.find().populate("user", "name email");
    } else {
      // Regular users can only see their own records
      records = await Attendance.find({ user: req.user.id });
    }

    res.json(records);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { markAttendance, getAttendanceRecords };
