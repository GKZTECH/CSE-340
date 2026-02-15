const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const validation = require("../utilities/validation");
const reviewModel = require("../models/reviewModel")

async function buildDetail(req, res) {
  try {
    const inv_id = req.params.id

    const vehicle = await model.getInventoryById(inv_id)

    if (!vehicle) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "Vehicle does not exist.",
        nav: []
      })
    }

    const reviews = await reviewModel.getReviewsByVehicle(inv_id)

    res.render("inventory/detail", {
      title: vehicle.inv_make + " " + vehicle.inv_model,
      vehicle,
      reviews: reviews || []   // Always send reviews
    })

  } catch (err) {
    console.error(err)
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Unable to load vehicle details.",
      nav: []
    })
  }
}

const invCont = {};

// Build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    let data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Vehicles";
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error in buildByClassificationId:', error);
    next(error);
  }
};

// Build inventory detail view by inventory id
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getInventoryById(inventory_id);
    
    if (!data || data.length === 0) {
      const error = new Error('Inventory item not found');
      error.status = 404;
      return next(error);
    }
    
    const vehicle = data[0];
    let nav = await utilities.getNav();
    const detailHTML = await utilities.buildVehicleDetail(vehicle);
    
    res.render("./inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailHTML,
      vehicle,
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error in buildByInventoryId:', error);
    next(error);
  }
};

// Build management view (Task 1)
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error in buildManagement:', error);
    next(error);
  }
};

// Build add classification view (Task 2)
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: [],
      classification_name: '',
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error in buildAddClassification:', error);
    next(error);
  }
};

// Process add classification form (Task 2)
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    
    // Add classification to database
    await invModel.addClassification(classification_name);
    
    // Set success message
    req.session.messages = {
      success: `Classification "${classification_name}" was successfully added.`
    };
    
    // Redirect to management view
    res.redirect('/inv');
  } catch (error) {
    console.error('Error in addClassification:', error);
    
    let nav = await utilities.getNav();
    let errors = [];
    
    if (error.message === 'Classification name already exists') {
      errors.push({ msg: 'Classification name already exists.' });
    } else {
      errors.push({ msg: 'Failed to add classification. Please try again.' });
    }
    
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name: classification_name || '',
      messages: req.session.messages || {}
    });
  }
};

// Build add inventory view (Task 3)
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: [],
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_image: '/images/vehicles/no-image.jpg',
      inv_thumbnail: '/images/vehicles/no-image-tn.jpg',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
      classification_id: '',
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error in buildAddInventory:', error);
    next(error);
  }
};

// Process add inventory form (Task 3)
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = req.body;
    
    // Add inventory to database
    await invModel.addInventory({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
    
    // Set success message
    req.session.messages = {
      success: `${inv_year} ${inv_make} ${inv_model} was successfully added.`
    };
    
    // Redirect to management view
    res.redirect('/inv');
  } catch (error) {
    console.error('Error in addInventory:', error);
    
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id || null);
    let errors = [{ msg: 'Failed to add vehicle. Please check your input and try again.' }];
    
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
      inv_make: inv_make || '',
      inv_model: inv_model || '',
      inv_year: inv_year || '',
      inv_description: inv_description || '',
      inv_image: inv_image || '/images/vehicles/no-image.jpg',
      inv_thumbnail: inv_thumbnail || '/images/vehicles/no-image-tn.jpg',
      inv_price: inv_price || '',
      inv_miles: inv_miles || '',
      inv_color: inv_color || '',
      classification_id: classification_id || '',
      messages: req.session.messages || {}
    });
  }
};

module.exports = invCont;