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

invCont.buildItemDetailView = async function (req, res, next) {
  const detailView_id = req.params.itemId;
  const data = await invModel.getDetailViewId(detailView_id);
  const grid = await utilities.buildDetailViewGrid(data);
  let nav = await utilities.getNav();

  const year = data[0].inv_year;
  const model = data[0].inv_model;
  const make = data[0].inv_make;

  res.render("./inventory/item-detail", {
    title: `${year} ${model} ${make}`,
    nav,
    grid,
  });
  console.error(error);
  res.status(500).send("Internal Server Error");
};
module.exports = invCont;
