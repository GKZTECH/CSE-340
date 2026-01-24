const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');
const utilities = require('../utilities');

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view by inventory id
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryId));

module.exports = router;