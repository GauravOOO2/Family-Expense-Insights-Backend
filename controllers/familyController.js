const Family = require('../models/Family');

// Create a new family
const createFamily = async (req, res) => {
  try {
    const { familyId, income, savings, dependents } = req.body;
    const newFamily = new Family({ familyId, income, savings, dependents });
    await newFamily.save();
    res.status(201).json({ message: 'Family created successfully', family: newFamily });
  } catch (error) {
    res.status(500).json({ message: 'Error creating family', error: error.message });
  }
};

module.exports = { createFamily };
