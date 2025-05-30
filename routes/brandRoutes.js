const express = require("express");
const brandController = require("../controllers/brandController");
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const productRouter = require("./productRoutes");

const router = express.Router({ mergeParams: true });

router.use(
  "/:brandId/products",
  productController.filterByBrands,
  productRouter
);

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
