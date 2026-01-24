const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

// Build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  let data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0]?.classification_name || "Vehicles";
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

// Build inventory detail view by inventory id
invCont.buildByInventoryId = async function (req, res, next) {
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
    vehicle
  });
};

module.exports = invCont;