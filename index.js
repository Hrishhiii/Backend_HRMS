// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const users = require("./routes/userRoutes");
// const attendanceRoutes = require("./routes/attendanceRoutes");
// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// // Initialize Express App
// const app = express();

// // Middleware
// app.use(express.json());

// // // Routes
// // app.get("/", (req, res) => {
// //   res.send("HRMS API Running...");
// // });

// app.use("/users", users);
// app.use("/leave-requests", require("./routes/leaveRoutes"));
// app.use("/attendance", require("./routes/attendanceRoutes"));



// // Error Handling Middleware
// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).json({ message: "Internal Server Error", error: err.message });
// // });

// // Define Port and Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB with error handling
connectDB().catch((err) => {
  console.error("❌ MongoDB Connection Failed:", err.message);
  process.exit(1); // Stop the app if DB connection fails
});

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // JSON Body Parser
app.use(cors()); // Enable CORS

// Import Routes
const users = require("./routes/userRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

// Routes
app.use("/users", users);
app.use("/leave-requests", leaveRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/dashboard", dashboardRoutes); // ✅ Added Dashboard Route

// Base API Route
app.get("/", (req, res) => {
  res.send("✅ HRMS API Running...");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Define Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
