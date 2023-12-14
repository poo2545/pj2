const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  Date: {
    type: Date,
    required: true,
  },
  BName: {
    type: String,
    default: '',  // Set a default value
  },
  Bcalories: {
    type: Number,
    required: true,
  },
  BProtein: {
    type: Number,
  },
  BFat: {
    type: Number,
  },
  BCarbohydrate: {
    type: Number,
  },
  BFiber: {
    type: Number,
  },
  LName: {
    type: String,
    default: '',  // Set a default value
  },
  Lcalories: {
    type: Number,
    required: true,
  },
  LProtein: {
    type: Number,
  },
  LFat: {
    type: Number,
  },
  LCarbohydrate: {
    type: Number,
  },
  LFiber: {
    type: Number,
  },
  DName: {
    type: String,
    default: '',  // Set a default value
  },
  Dcalories: {
    type: Number,
    required: true,
  },
  DProtein: {
    type: Number,
  },
  DFat: {
    type: Number,
  },
  DCarbohydrate: {
    type: Number,
  },
  DFiber: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


const Meal = mongoose.model('Meal', MealSchema);

module.exports = Meal;

