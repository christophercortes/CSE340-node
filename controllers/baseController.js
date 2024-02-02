const utilities = require("../utilities/");
const { buildLogin } = require("./accountController");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  // req.flash("notice", "This is a flash messages.")
  res.render("index", { title: "Home", nav });
};

// baseController, buildLogin = async function (req, res) {
//   const loginMessage = await utilities.getNav();
//   req.flash("notice", "Hi!")
//   res.render("index", { title: "Login", loginMessage });
// };

module.exports = baseController;
