const invModel = require("../models/inventory-model");

const utilities = {};

// Function to handle errors in async routes
utilities.handleErrors = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Build the navigation list
utilities.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  data.rows.forEach(row => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="View our ${row.classification_name} lineup">${row.classification_name}</a></li>`;
  });
  list += "</ul>";
  return list;
};

// Build the classification grid
utilities.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        </a>
        <div class="price">$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</div>
        <hr>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// Build vehicle detail HTML
utilities.buildVehicleDetail = async function (vehicle) {
  // Format price and mileage with proper formatting
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(vehicle.inv_price);
  
  const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);
  
  // Build the detail HTML structure
  const detailHTML = `
    <div class="vehicle-detail-container">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" 
             alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" 
             class="detail-image">
      </div>
      <div class="vehicle-info">
        <h2 class="vehicle-title">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        
        <div class="vehicle-pricing">
          <span class="price">${formattedPrice}</span>
          <span class="mileage">${formattedMileage} miles</span>
        </div>
        
        <div class="vehicle-specs">
          <div class="spec-item">
            <strong>Color:</strong>
            <span>${vehicle.inv_color}</span>
          </div>
          <div class="spec-item">
            <strong>Classification:</strong>
            <span>${vehicle.classification_name}</span>
          </div>
          <div class="spec-item">
            <strong>Description:</strong>
            <p class="description">${vehicle.inv_description}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return detailHTML;
};

module.exports = utilities;