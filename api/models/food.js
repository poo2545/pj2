const mongoose = require('mongoose');

// Define the schema for food information
const foodSchema = new mongoose.Schema({
  FoodName: {
    type: String,
    required: true,
  },
  FoodProtein: {
    type: Number,
  },
  FoodFat: {
    type: Number,
  },
  FoodCarbo: {
    type: Number,
  },
  FoodFiber: {
    type: Number,
  },
  FoodCalorie: {
    type: Number,
  },
  FoodImage:{
    type: String,
    required: true,
  },
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
