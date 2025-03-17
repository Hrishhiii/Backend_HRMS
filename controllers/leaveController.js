const Leave = require("../models/Leave");

// Apply Leave
const applyLeave = async (req, res) => {
  try {
    const { leave_type, start_date, end_date } = req.body;

    // Ensure user is authenticated and extract user ID
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const leaveRequest = new LeaveRequest({
      user_id: req.user.id,  // Automatically fetch the logged-in user ID
      leave_type,
      start_date,
      end_date,
      status: "Pending",
      applied_on: new Date().toISOString()
    });

    await leaveRequest.save();
    
    res.status(201).json({ message: "Leave request submitted", leave_id: leaveRequest._id });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Approve Leave (Only for Managers)
const approveLeave = async (req, res) => {
  try {
    if (req.user.role !== "Manager") {
      return res.status(403).json({ message: "Only Managers can approve leave requests" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = "Approved";
    await leave.save();

    res.json({ message: "Leave Approved", leave });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { applyLeave, approveLeave };
