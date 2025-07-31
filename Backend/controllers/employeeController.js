const Employee = require("../models/Employee");

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search employee by name
const searchEmployee = async (req, res) => {
  try {
    const name = req.query.name;

    if (!name) {
      return res.status(400).json({ message: "Name query param is required" });
    }

    const employee = await Employee.findOne({
      name: { $regex: new RegExp(name, "i") },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add a new employee
const createEmployee = async (req, res) => {
  const { name, role, department, email, phone } = req.body;

  const newEmployee = new Employee({
    name,
    role,
    department,
    email,
    phone,
  });

  try {
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAllEmployees, searchEmployee, createEmployee };
