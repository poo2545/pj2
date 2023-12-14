const mongoose = require('mongoose');

// Define the schema for food information
const foodSchema = new mongoose.Schema({
  FoodName: {
    type: String,
    required: true,
  },
  FoodProtein: {
    type: String,
    required: true,
  },
  FoodFat: {
    type: String,
    required: true,
  },
  FoodCarbo: {
    type: String,
    required: true,
  },
  FoodFiber: {
    type: String,
    required: true,
  },
  FoodCalorie: {
    type: String,
    required: true,
  },
});

// Create the Food model
const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
