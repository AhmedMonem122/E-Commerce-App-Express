const express = require("express");
const brandController = require("../controllers/brandController");

const router = express.Router();

router
  .route("/")
  .get(brandController.getAllBrands)
  .post(brandController.addBrand);

router
  .route("/:id")
  .get(brandController.getSpecificBrand)
  .patch(brandController.updateBrand)
  .delete(brandController.deleteBrand);

module.exports = router;
