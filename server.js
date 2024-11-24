require("dotenv").config(); // Подключение dotenv для работы с переменными окружения
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const generateAccessToken = require("./middleware/generateAccessToken");
const generateRefreshToken = require("./middleware/generateRefreshToken");
const User = require("./models/user");
const app = express();

// Middleware для обработки JSON и CORS
app.use(express.json());
app.use(cors());

// Подключение к базе данных MongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

// Маршрут для регистрации пользователей
app.post("/api/users/register", async (req, res) => {
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

// Маршрут для логина пользователей
app.post("/api/users/login", async (req, res) => {
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

// Маршрут для получения данных о текущем пользователе
app.get("/api/users/me", async (req, res) => {
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

// Маршрут для углеродных выбросов (можно добавить дополнительную логику для работы с углеродными выбросами)
app.post("/api/carbonuses", async (req, res) => {
  // Добавьте логику для работы с углеродными выбросами
  res.status(200).json({ message: "Carbon emission added." });
});

// Главная страница сервера
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// Запуск сервера
app.listen(4000, () => {
  console.log(`Server running on ${process.pid} @ 4000`);
});
