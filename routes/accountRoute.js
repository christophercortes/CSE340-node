// Needed Access to External Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController"); // it will be built later
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

//This is the path that will be sent when the "My Account" link is cliked.
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// This is the path to "Registration"
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration)
);

//This is the path to Management View
router.get(
  "/management",
  utilities.handleErrors(accountController.buildManagement)
);

// This is the Path to Add Inventory
router.get(
  "/add-inventory",
  utilities.handleErrors(accountController.buildAddInventory)
);

//This is the path to Add Classification
router.get(
  "/add-classification",
  utilities.handleErrors(accountController.buildAddNewCarClassification)
);

// This is the path to the ManagementView file under account folder.
// router.get(
//   "/managementView",
//   utilities.handleErrors(accountController.buildManagementView)
// );

router.get(
  "/edit-inventory",
  utilities.handleErrors(accountController.buildEdit)
);

router.get(
  "/managementView",
  utilities.handleErrors(accountController.buildManagementView)
);

router.get(
  "/delete-confirm",
  utilities.handleErrors(accountController.accountDelete)
);

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagementView)
);

router.get(
  "/updateAccount",
  utilities.handleErrors(accountController.accountUpdateView)
);

/* ************************** */

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerNewUserAccount)
);

router.post(
  "/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(accountController.AddNewCar)
);

router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInvData,
  utilities.handleErrors(accountController.AddNewInventory)
);

router.post(
  "/updateAccount",
  utilities.handleErrors(accountController.registerUpdateAccount)
);

// Process the login attempt
// router.post("/login", (req, res) => {
//   res.status(200).send("login process");
// });

module.exports = router;
