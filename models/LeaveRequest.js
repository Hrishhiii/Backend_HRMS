const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Changed from `user_id`
  leave_type: { type: String, enum: ["Paid", "Sick"], required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  applied_on: { type: Date, default: Date.now },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Store Manager ID
});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
