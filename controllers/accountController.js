const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

/*Deliver Delete view */
async function accountDelete(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/delete-confirm", {
    title: "Delete Inventory",
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

/* ManagementView under account folder view */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/managementView", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/*Deliver the Inventory Edit view */
async function buildEdit(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/edit-inventory", {
    title: "Edit Inventory",
    nav,
    errors: null,
  });
}

/*Deliver the Account Update view */
async function accountUpdateView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/updateAccount", {
    title: "Update Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */

/* ************************
* Process Account Registration
**************************/
async function registerNewUserAccount(req, res) {
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

  const regResult = await accountModel.registerNewAccount(
    // there must be a typo with the name
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

/* ****************************************
 *  Process login request
 * ************************************ */
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
      return res.redirect("account/managementView", {
        title: "Logout",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}


/* ****************************
 * Process Update Account request
 * ****************************/
async function updateUserAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;
  try {
    const regResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email
    );
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you updated your new ${account_firstname} account.`
      );
      res.status(201).render("", {
        title: "New view",
        nav,
      }); // create a new view.
    } else {
      req.flash("notice", "Sorry, you couldn't update your new account.");
      res.status(501).render("add view", {
        title: "new title",
        nav,
      });
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.status(500).redirect("/error");
  }
}
/* ************************
* Process Account Registration
**************************/
// async function registerAccount(req, res) {
//   let nav = await utilities.getNav();
//   const {
//     account_firstname,
//     account_lastname,
//     account_email,
//     account_password,
//   } = req.body;

//   // Hash the password before storing
//   let hashedPassword;
//   try {
//     // regular password and cost (salt is generated automatically)
//     hashedPassword = await bcrypt.hashSync(account_password, 10);
//   } catch (error) {
//     req.flash(
//       "notice",
//       "Sorry, there was an error processing the registration."
//     );
//     res.status(500).render("account/register", {
//       title: "Registration",
//       nav,
//       errors: null,
//     });
//   }

//   const regResult = await accountModel.registerNewAccount(
//     // there must be a typo with the name
//     account_firstname,
//     account_lastname,
//     account_email,
//     hashedPassword
//   );

//   if (regResult) {
//     req.flash(
//       "notice",
//       `Congratulations, you\'re registered ${account_firstname}. Please log in.`
//     );
//     res.status(201).render("account/login", {
//       title: "Login",
//       nav,
//     });
//   } else {
//     req.flash("notice", "Sorry, the registration failed.");
//     res.status(501).render("account/register", {
//       title: "Registration",
//       nav,
//     });
//   }
// }


/* **************************
 * Process Add New Car
 * **************************/

async function AddNewCar(req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const classificationData = await accountModel.checkExistingClassification(classification_name);
  if (!classificationData) {
    req.flash("notice", "Please provide a valide classification.");
    res.status(400).render("inventory/add-classification", {
      title: "Add new Classification",
      nav,
      errors: null,
      classification_name,
    });
  } else {
    req.flash("notice", `Congratulations, You added a new ${classification_name} in the inventory.`);
    res.status(201).render("inventory/management", {
      title: "Management View",
      nav,
    })
  };
}

/* **************************
 * Process Add New Inventory
 * **************************/
async function AddNewInventory(req, res) {
  let nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_images,
    inv_description,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

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

/* ****************************
 * Process Register request
 * ****************************/
async function registerUpdateAccount(req, res) {
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
    res.status(500).render("account/updateAccount", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.updateAccount(
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
    res.status(501).render("account/updateAccount", {
      title: "Registration",
      nav,
    });
  }
}

/* ***************************
* Process the Password Update
* ***************************/
async function updateNewPassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice", "Sorry, there was a problem processing the registration."
    );
    res.status(500).render("accountUpdate", {
      title: "Update Password",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.updatePassword(
    hashedPassword
  );
  if (regResult) {
    req.flash(
      "notice", `Congratulations, you Updates your Password.`
    );
    res.status(201).render("....", {
      title: "New Password",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, you counldn't update password.");
    res.status(501).render("...", {
      title: "...",
      nav,
    });
  }

}

module.exports = {
  buildLogin,
  buildRegistration,
  //registerAccount,
  buildManagement,
  buildAddNewCarClassification,
  buildAddInventory,
  accountLogin,
  registerNewUserAccount,
  AddNewCar,
  AddNewInventory,
  buildManagementView,
  buildEdit,
  //accountManagementView,
  accountUpdateView,
  registerUpdateAccount,
  updateUserAccount,
  updateNewPassword,
  accountDelete
};
