const express = require("express");
const CarbonEmission = require("../models/carbonEmissionUse");
const User = require("../models/user");

const router = express.Router();

router.post("/addEmission", async (req, res) => {
  const {
    userId,
    carDistance,
    publicTransport,
    flights,
    electricity,
    homeHeating,
    diet,
    weeklyTrashGenerated,
    onlineShop,
    numberOfPeopleInFamily,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) 
      return res.status(404).json({ message: "User not found" });
    

    const carbonEmission = new CarbonEmission({
      carDistance,
      publicTransport,
      flights,
      electricity,
      homeHeating,
      diet,
      weeklyTrashGenerated,
      onlineShop,
      numberOfPeopleInFamily,
    });

    const result = carbonEmission.calculateCarbonEmissions();
    carbonEmission.result = result;

    const savedEmission = await carbonEmission.save();

    user.carbonEmissions.push(savedEmission._id);
    user.carbonEmissionUse += result; 

    await user.save();

    res.status(201).json({ message: "Carbon emission added successfully.", user, savedEmission });
  } catch (error) {
    res.status(500).json({ message: "Error adding carbon emission.", error });
  }
});


router.get("/suggestions/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("carbonEmissions");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const latestEmission = user.carbonEmissions[user.carbonEmissions.length - 1];

    if (!latestEmission) {
      return res.status(404).json({ message: "No emission data found for the user." });
    }

    const suggestions = [];

    if (latestEmission.carDistance > 100) {
      suggestions.push("Reduce car usage and consider public transport, cycling, or walking.");
    }

    if (latestEmission.publicTransport > 50) {
      suggestions.push("Consider optimizing your public transport trips or carpooling.");
    }

    if (latestEmission.flights > 500) {
      suggestions.push("Minimize flights, and opt for trains for short-distance travel.");
    }

    if (latestEmission.electricity > 200) {
      suggestions.push("Optimize electricity usage: use energy-efficient lightbulbs and unplug unused devices.");
    }

    if (latestEmission.homeHeating > 300) {
      suggestions.push("Improve home insulation to reduce energy consumption for heating.");
    }

    if (latestEmission.weeklyTrashGenerated > 5) {
      suggestions.push("Reduce waste by recycling and using reusable containers.");
    }

    if (latestEmission.onlineShop > 5) {
      suggestions.push("Limit online shopping and consolidate orders to reduce your carbon footprint.");
    }

    if (latestEmission.diet === "Comprehensive") {
      suggestions.push("Consider transitioning to a more plant-based diet, like vegetarian or vegan options.");
    }

    if (latestEmission.numberOfPeopleInFamily > 4) {
      suggestions.push("Share resources with family members to optimize usage and reduce emissions.");
    }

    res.status(200).json({
      message: "Suggestions for reducing carbon emissions.",
      suggestions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching suggestions.", error });
  }
});



module.exports = router;
