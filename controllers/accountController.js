const utilities = require("../utilities");

/* Delivering a Login View */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    //login match in render function controller
    title: "Login",
    nav,
  });
}

module.exports = { buildLogin };
