const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const { getClassifications } = require("../models/inventory-model");

/* ***************************
* Delivering the View
* ***************************/

/* Login View */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    //login match in render function controller
    title: "Login",
    nav,
    errors: null,
  });
}

/* registration view */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    //register must match in the login.js function
    title: "Register",
    nav,
    errors: null,
  });
}

/* Management View */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    erros: null,
  });
}

/* Classification view */
async function buildAddClassification(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: req.flash("error"), // Pass errors to the template
    });
  } catch (error) {
    next(error); // Pass any unexpected errors to the error handler
  }
}

/* Inventory View */
async function buildAddInventory(req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classifications = await getClassifications();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classifications,
      errors: req.flash("error"),
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* *****************************
 * Process login request
 * *****************************/
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

async function accountManagementView(req, res) {
  let nav = await utilities.getNav();
  res.render("/account/managementView", {
    title: "You're logged in",
    nav,
    errors: null,
  });
}



module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  buildManagement,
  buildAddClassification,
  buildAddInventory,
  accountLogin,
  accountManagementView,
};
