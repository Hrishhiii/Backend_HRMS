const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Employee", "Manager", "Admin"], default: "Employee" },
  dob: String,
  date_of_joining: String,
  manager_id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("User", userSchema);
