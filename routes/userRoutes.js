const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const { updateUser } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile); // Protected Route
router.put("/update/:id", authMiddleware, updateUser);

module.exports = router;
