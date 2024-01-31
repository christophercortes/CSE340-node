// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build individual item detail view
router.get("/item/:itemId", invController.buildItemDetailView);

router.get("/throwerror", invController.buildError);

module.exports = router;
