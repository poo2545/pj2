const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
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
    type: Date, // เพิ่มวันเดือนปีเกิด
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
    type: String, // เพิ่มประเภทของเบาหวาน
    required: true,
  },
  freindRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentFriendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
