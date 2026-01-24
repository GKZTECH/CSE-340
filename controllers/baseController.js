const utilities = require("../utilities");

const baseController = {};

baseController.buildHome = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("index", {
    title: 'Home | CSE Motors',
    nav,
  });
};

module.exports = baseController;