const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authorizeInventory = require('./middleware/authorizeInventory');

// Public routes – no middleware
router.get('/classification/:id', inventoryController.getClassification);
router.get('/detail/:vehicleId', inventoryController.getVehicleDetail);

// Protected admin routes
router.get('/add-classification', authorizeInventory, inventoryController.showAddClassification);
router.post('/add-classification', authorizeInventory, inventoryController.addClassification);
router.get('/add-vehicle', authorizeInventory, inventoryController.showAddVehicle);
router.post('/add-vehicle', authorizeInventory, inventoryController.addVehicle);
// ... edit, delete routes similarly

module.exports = router;