const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),

    body("classification_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a classification name."), // on error this message is sent.

    body("inv_make")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide make name."), // on error this message is sent.

    body("inv_mode")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a mode name."),

    body("inv_image")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a image name."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a thumbnail name."),

    body("inv_price")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a price."),

    body("inv_year")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a year."),

    body("inv_miles")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide miles."),

    body("inv_color")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a color name."),
  ];
   
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification"), {
      errors,
      title: "Classification",
      nav,
      classification_name
    }
    return;
  }
  next();
};

validate.checkInvData = async (req, res, next) => {
  const { inv_make, inv_mode, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory"), {
      errors,
      title: "Inventory",
      nav,
      inv_make,
      inv_mode,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    }
    return;
  }
  next();
};

module.exports = validate;
