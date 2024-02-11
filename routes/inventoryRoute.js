// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build individual item detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

router.get("/throwerror", invController.buildError);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build the Add inventory view 
router.get(
  "/inventory/edit-inventory/:inventory_id",utilities.handleErrors(
  invController.buildByEditInventoryId)
);

module.exports = router;
