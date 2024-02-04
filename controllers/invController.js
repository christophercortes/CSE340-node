const { render } = require("ejs");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***********************
 * Build inventory item detail view
 * ***********************/

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getDetailsByInventoryId(inventory_id);
  const grid = await utilities.buildDetailGrid(data);
  let nav = await utilities.getNav();

  const year = data[0].inv_year;
  const model = data[0].inv_model;
  const make = data[0].inv_make;
  res.render("./inventory/classification", {
    title: `${year} ${make} ${model}`,
    nav,
    grid,
  });
};

invCont.buildError = function (req, res, next) {
  throw { message: "there is an error" };
};

/* **************************
* Build Classification View
* **************************/

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_name = req.params.inventoryId;
  const data = await invModel.getAddInventoryId(classification_name);
  const grid = await utilities.buildAddClassificationGrid(data);
  let nav = await utilities.getNav();
  nav.push({ name: classification_name, link: `/partial/navigation` });
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    grid,
  });
};

/* ***********************
* Build add-inventory View
* ***********************/

invCont.buildByAddInventoryId = async function (req, res, next) {
  const addInventory_id = req.params.inventoryId;
  const data = await invModel.getAddInventoryId(addInventory_id);
  const grid = await utilities.buildAddInventoryGrid(data);
  let nav = await utilities.getNav();
  res.render("./inv/add-inventory", {
    title: "Add Inventory",
    nav,
    grid,
  });
}; 

module.exports = invCont;
