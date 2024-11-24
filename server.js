require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cluster = require("cluster");
const userRoutes = require("./routes/userRoutes");
const carbonRoutes = require("./routes/carbonEmissionUseRoutes");
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(express.json());
app.use(cors());



mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));


  app.get("/", (req, res) => {
    res.send("Server is working!");
  });
  
app.use("/api/users", userRoutes);
app.use("/api/carbonuses", carbonRoutes);


  app.listen(4000, () => {
    console.log(`Server running on ${process.pid} @ 4000`);
  });