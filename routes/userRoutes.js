const express = require("express");
const generateAccessToken = require("../middleware/generateAccessToken");
const generateRefreshToken = require("../middleware/generateRefreshToken");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, carbonEmissionUse } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,  
        carbonEmissionUse,
      });
  
      await newUser.save();
      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error registering user.", error });
    }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user.", error });
  }
});
  
router.get("/me", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
      return res.status(401).json({ message: "No token provided." });
  }

  try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 

      const user = await User.findById(decoded.id).populate("carbonEmissions"); 

      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      res.json({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          carbonEmissionUse: user.carbonEmissionUse,
          carbonEmissions: user.carbonEmissions,
      });
  } catch (error) {
      res.status(401).json({ message: "Invalid token." });
  }
});

module.exports = router;


router.get("/userId", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ userId: user._id });
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
});

  
  
router.get("/me", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
      return res.status(401).json({ message: "No token provided." });
  }

  try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 

      const user = await User.findById(decoded.id).populate("carbonEmissions"); 

      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      res.json({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          carbonEmissionUse: user.carbonEmissionUse,
          carbonEmissions: user.carbonEmissions,
      });
  } catch (error) {
      res.status(401).json({ message: "Invalid token." });
  }
});


module.exports = router;