const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');
const utilities = require('../utilities');
const validation = require('../utilities/validation');

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view by inventory id
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryId));

// Management view route (Task 1)
router.get('/', utilities.handleErrors(invController.buildManagement));

// Add classification routes (Task 2)
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));
router.post('/add-classification',
  validation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add inventory routes (Task 3)
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));
router.post('/add-inventory',
  validation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;