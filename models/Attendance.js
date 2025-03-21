const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Present", "Absent", "Late"], required: true }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
