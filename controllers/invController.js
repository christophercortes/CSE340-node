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

/* *************************
 * Build vehicle management view
 * *************************/
invCont.buildManagementId = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  });
};

/* **************************
 * Build Classification View
 * **************************/

invCont.buildByClassificationNameId = async function (req, res, next) {
  const classification_name = req.params.inventoryId;
  const data = await invModel.getAddInventoryId(classification_name);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
 // nav.push({ name: classification_name, link: `/partial/navigation` });
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
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    grid,
  });
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***********************
 * Build edit inventory View
 * ***********************/
invCont.buildByEditInventoryId = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

module.exports = invCont;
