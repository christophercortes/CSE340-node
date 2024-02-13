const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const { getClassifications } = require("../models/inventory-model");

/* ***************************
 * Delivering the View
 * ***************************/

/* Deliver login view */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    // indicates the view to be returned to the client.
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
    title: "Management View",
    nav,
    errors: null,
  });
}

/* Classification view */
async function buildAddNewCarClassification(req, res, next) {
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
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: req.flash("error"),
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */

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

/* ****************************
 * Process Register request
 * ****************************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

async function accountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* **************************
 * Process Add New Car
 * **************************/

async function AddNewCar(req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  try {
    const regResult = await accountModel.AddNewCarToClassification(
      classification_name
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you added a new ${classification_name} classification.`
      );
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, you couldn't add the new classification.");
      res.status(501).render("inventory/add-classification", {
        title: "Add new Classification",
        nav,
      });
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.status(500).redirect("/error");
  }
}


/* **************************
 * Process Add New Inventory
 * **************************/
async function AddNewInventory(req, res) {
  let nav = await utilities.getNav();
  const { inv_make,
    inv_model,
    inv_images,
    inv_description,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  classification_id} = req.body;
  
  const regResult = await accountModel.AddNewItemToInventory(
    inv_make,
    inv_model,
    inv_images,
    inv_description,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color, 
    classification_id
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, You added a new ${classification_id} in the inventory.`
    );
    res.status(201).render("inventory/management", {
      title: "Inventory",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    });
  }  
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  buildManagement,
  buildAddNewCarClassification,
  buildAddInventory,
  accountLogin,
  accountManagement,
  AddNewCar,
  AddNewInventory
};
