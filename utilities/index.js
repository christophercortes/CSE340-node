const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
        ' on CSE Motors" /></a>';
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
      grid += `<td class="detail-value">$${new Intl.NumberFormat(
        "en-US"
      ).format(vehicle.inv_price)}</td>`;
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
      grid += `<td class="detail-value">${new Intl.NumberFormat("en-US").format(
        vehicle.inv_miles
      )}</td>`;
      grid += `</tr>`;
      grid += `</table>`;
    });
    grid += `</div>`;
  } else {
    grid = `<p class="notice">Sorry, no matching vehicle could be found.</p>`;
  }

  return grid;
};

Util.buildClassificationList = async function (classification_id) {
  let data = await invModel.getClassifications();
  let select = `<label for=classification_id>Classification:</label><select id="classificaiton_id" class="" name="classificaiton_name" required>
  <option value="">Select Classification</option>`;
  for (var i = 0; i < data.rowCount; i++) {
    const selected =
      classification_id && data.rows[i].classification_id === classification_id
        ? "selected"
        : "";
    select += `<option value="${data.rows[i].classification_id}" ${selected}>${data.rows[i].classification_name}</option>`;
  }
  select += "</select>";
  return select;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
