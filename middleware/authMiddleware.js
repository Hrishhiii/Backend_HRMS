const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

const isManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access Denied: Manager Only" });
  }
  next();
};

module.exports = { authMiddleware, isManager };
