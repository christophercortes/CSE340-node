// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
// the route must match the one from utilities/index.js
//invController.buildByClassification function within the invController will be used to fulfill the request sent by the route.
router.get("/type/:classificationId",
  invController.buildByClassificationId);

// Route to build individual item detail view
router.get("/detail/:inventoryId",
  invController.buildByInventoryId);

// router.get("/throwerror",
//   invController.buildError);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build the Add inventory view 
router.get(
  "/inventory/:inventory_id",utilities.handleErrors(
  invController.buildByEditInventoryId)
);

module.exports = router;
