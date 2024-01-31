const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

module.exports = Util;

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors"/></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ************************ */

Util.buildDetailGrid = async function (data) {
  let grid;

  if (data.length > 0) {
    grid = `<div id="detail-inv-grid">`;
    data.forEach((vehicle) => {
      grid += `<div class="vehicle-detail">`;
      grid += `<img src="${vehicle.inv_image}" alt="Images of ${vehicle.inv_model} on CSE Motors" />`;
      grid += `<h1 class="">${vehicle.inv_make} ${vehicle.inv_model} description</h1>`;
      grid += `<table>`;
      grid += `<tr>`;
      grid += `<td class="detail-label">Price:</td>`;
      grid += `<td class="detail-value">$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</td>`;
      grid += `</tr>`;
      grid += `</table>`;
      grid += `<div class="vehicle-description">`;
      grid += `<h3 class="paragraph-title">Description:</h3>`;
      grid += `<p class="">${vehicle.inv_description}</p>`;
      grid += `</div>`;
      grid += `<table>`;
      grid += `<tr>`;
      grid += `<td class="detail-label">Color:</td>`;
      grid += `<td class="detail-value">${vehicle.inv_color}</td>`;
      grid += `</tr>`;
      grid += `<tr>`;
      grid += `<td class="detail-label">Mileage:</td>`;
      grid += `<td class="detail-value">${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)}</td>`;
      grid += `</tr>`;
      grid += `</table>`;
    });
    grid += `</div>`;
  } else {
    grid = `<p class="notice">Sorry, no matching vehicle could be found.</p>`;
  }

  return grid;
};

/* ***************************
 * Middleware For Handling Errors
 * Wrap other functions in this for
 * General Error Handling
 ***************************** */

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
