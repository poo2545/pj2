const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  weight: {
    type: Number, // เพิ่มน้ำหนัก
    required: true,
  },
  height: {
    type: Number, // เพิ่มส่วนสูง
    required: true,
  },
  diabetesType: {
    type: String,
    required: true,
  },
    challengeCalorie: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
