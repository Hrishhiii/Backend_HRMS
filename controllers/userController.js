// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// // Generate JWT Token
// const generateToken = (user) => 
//   jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// // Register User
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Create new user
//     const newuser = new User({ name, email, password, role });
//     await newuser.save();
//     res.status(201).json({ 
//       message: "User Registered Successfully", 
//       token: generateToken(newuser),
//       User: newuser
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // Login User
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(req.body);
    
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     // Check password
//     // const isMatch = await bcrypt.compare(password, user.password);
//     // if (!isMatch) {
      
//     // }

//     // else{
//     //   return res.status(400).json({ message: "Invalid Credentials" });
//     // }
//     res.json({ 
//       message: "Login Successful", 
//       token: generateToken(user),
//       user: { id: user._id, name: user.name, email: user.email, role: user.role }
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // Get User Profile (Protected Route)
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// module.exports = { registerUser, loginUser, getUserProfile };


const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (user) => 
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Register User with Password Hashing
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ 
      message: "User Registered Successfully", 
      token: generateToken(newUser),
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Login User with Password Verification
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    res.json({ 
      message: "Login Successful", 
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get User Profile (Protected Route)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log("Request Params ID:", req.params.id);
    console.log("Request Body:", req.body);

    const { name, email, role } = req.body;
    const userId = req.params.id;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated User:", updatedUser);

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Correctly Export All Functions
module.exports = { registerUser, loginUser, getUserProfile, updateUser };
