const express = require("express");
const LeaveRequest = require("../models/LeaveRequest");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Apply for Leave (Protected)
router.post("/leave", authMiddleware, async (req, res) => {
  try {
    const leaveRequest = new LeaveRequest({
      user: req.user.id, // Extracted from JWT Token
      ...req.body,
      status: "Pending", // Default status
    });

    await leaveRequest.save();
    res.status(201).json({ message: "Leave request submitted", leave_id: leaveRequest._id });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Approve Leave (Only for Managers)
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    // Check if the user is a Manager
    if (req.user.role !== "Manager") {
      return res.status(403).json({ message: "Only Managers can approve leave requests" });
    }

    // Find the leave request
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Access Denied" });
    }

    // Approve the leave
    leave.status = "Approved";
    leave.approved_by = req.user.id; // Store Manager ID who approved
    await leave.save();

    res.json({ message: "Leave request approved", leave });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
