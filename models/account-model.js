const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerNewAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

async function registerLocalAddress(account_address) {
  try {
    const sql = "INSERT INTO public.account (account_address) VALUES ($1) RETURNING*"
    const result = await pool.query(sql, [account_address]);
    return result.rows[0];
  } catch (error) {
    return new Error(error.message);
  }
}

/* ************************
 * Add a new Car to Classification
 * ************************/
async function AddNewCarToClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    return new Error(error.message);
  }
}

/* ************************
 * Add new Inventory
 * ************************/

async function AddNewItemToInventory(
  inv_make,
  inv_model,
  inv_images,
  inv_description,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  try {
    const sql =
      "INSERT INTO inventory (inv_make, inv_model, inv_images, inv_description, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_images,
      inv_description,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const classificationName = await pool.query(sql, [classification_name]);
    return classificationName.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ****************************
* Get account information based on email but on id
* ****************************/
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_password FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching ID found.")
  }
}

/* ***************************
* Update account information
* ***************************/
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const sql =
      "UPDATE public.account SET  account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";

    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("account-model/updateAccount error: " + error);
  }
}

/* *****************************
 * Update account password
 * ***************************** */
async function updatePassword(account_id, account_password) {
  try {
    const sql =
      "UPDATE public.account SET  account_password = $1 WHERE account_id = $2 RETURNING *"

    const data = await pool.query(sql, [account_password, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("account-model/updatePassword error: " + error)
  }
}

module.exports = {
  registerNewAccount,
  checkExistingEmail,
  checkExistingClassification,
  getAccountByEmail,
  AddNewCarToClassification,
  AddNewItemToInventory,
  getAccountById, 
  updateAccount,
  updatePassword,
  registerLocalAddress
};
