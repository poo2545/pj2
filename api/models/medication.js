const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  time: String,
  dosage: String,
  medicationName: String,
  size: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;