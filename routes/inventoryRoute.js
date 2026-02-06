const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');
const utilities = require('../utilities');
const validation = require('../utilities/validation');
const authMiddleware = require('../utilities/authMiddleware');

// Public routes (no authentication required)
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryId));

// Protected routes - require authentication
router.get('/',
  authMiddleware.isAuthenticated,
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
);

router.get('/add-classification',
  authMiddleware.isAuthenticated,
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post('/add-classification',
  authMiddleware.isAuthenticated,
  authMiddleware.isEmployeeOrAdmin,
  validation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get('/add-inventory',
  authMiddleware.isAuthenticated,
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post('/add-inventory',
  authMiddleware.isAuthenticated,
  authMiddleware.isEmployeeOrAdmin,
  validation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;