const express = require("express");
const brandController = require("../controllers/brandController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(brandController.getAllBrands)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    brandController.uploadBrandImage,
    brandController.uploadBrandImageToFirebase,
    brandController.addBrand
  );

router
  .route("/:id")
  .get(brandController.getSpecificBrand)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    brandController.uploadBrandImage,
    brandController.uploadBrandImageToFirebase,
    brandController.updateBrand
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    brandController.deleteBrand
  );

module.exports = router;
