const utilities = require('./index');

const validation = {};

// Validation rules for classification
validation.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  
  // Check if classification name is provided
  if (!classification_name) {
    errors.push({ msg: 'Classification name is required.' });
  }
  
  // Check for special characters and spaces
  if (classification_name) {
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialChars.test(classification_name)) {
      errors.push({ msg: 'Classification name cannot contain special characters.' });
    }
    if (classification_name.includes(' ')) {
      errors.push({ msg: 'Classification name cannot contain spaces.' });
    }
    if (classification_name.length > 30) {
      errors.push({ msg: 'Classification name cannot exceed 30 characters.' });
    }
  }
  
  // If there are errors, render the form again with error messages
  if (errors.length > 0) {
    let nav = await utilities.getNav();
    return res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      errors,
      classification_name: classification_name || ''
    });
  }
  
  next();
};

// Validation rules for inventory
validation.checkInventoryData = async (req, res, next) => {
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
  
  let errors = [];
  
  // Check required fields
  if (!inv_make) errors.push({ msg: 'Make is required.' });
  if (!inv_model) errors.push({ msg: 'Model is required.' });
  if (!inv_year) errors.push({ msg: 'Year is required.' });
  if (!inv_description) errors.push({ msg: 'Description is required.' });
  if (!inv_image) errors.push({ msg: 'Image path is required.' });
  if (!inv_thumbnail) errors.push({ msg: 'Thumbnail path is required.' });
  if (!inv_price) errors.push({ msg: 'Price is required.' });
  if (!inv_miles) errors.push({ msg: 'Mileage is required.' });
  if (!inv_color) errors.push({ msg: 'Color is required.' });
  if (!classification_id) errors.push({ msg: 'Classification is required.' });
  
  // Validate year format
  if (inv_year && (isNaN(inv_year) || inv_year.length !== 4)) {
    errors.push({ msg: 'Year must be a 4-digit number.' });
  }
  
  // Validate price
  if (inv_price && (isNaN(inv_price) || parseFloat(inv_price) <= 0)) {
    errors.push({ msg: 'Price must be a positive number.' });
  }
  
  // Validate mileage
  if (inv_miles && (isNaN(inv_miles) || parseInt(inv_miles) < 0)) {
    errors.push({ msg: 'Mileage must be a positive number.' });
  }
  
  // If there are errors, render the form again with error messages and sticky data
  if (errors.length > 0) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id || null);
    
    return res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
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
      classification_id: classification_id || ''
    });
  }
  
  next();
};

module.exports = validation;