const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  searchEmployee,
  createEmployee,
} = require("../controllers/employeeController");

// Routes
router.get("/", getAllEmployees);
router.get("/search", searchEmployee);
router.post("/create", createEmployee);

module.exports = router;
