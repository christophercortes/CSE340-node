// Needed Access to External Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController"); // it will be built later
const utilities = require("../utilities");

//This is the path that will be sent when the "My Account" link is cliked.
router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;
