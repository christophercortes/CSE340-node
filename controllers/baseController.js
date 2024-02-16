const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  //req.flash("notice", "This is a flash messages.");
  res.render("index", { title: "Home", nav });
};

baseController.error = async function (req, res) {
  throw new intentionalError("see basecontroller.js");
};

class intentionalError extends Error {
  constructor(message) {
    super(message);
    this.name = "Intentional Error";
  }
}

module.exports = baseController;
