const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  department: String,
  email: String,
  phone: String,
});

module.exports = mongoose.model("Employee", EmployeeSchema);
