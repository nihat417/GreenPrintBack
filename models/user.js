const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  carbonEmissionUse: {
    type: Number,
    default: 0,
  },
  carbonEmissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarbonEmission", 
    },
  ],
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;
