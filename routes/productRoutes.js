const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router({ mergeParams: true });

router.use("/:productId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(productController.aliasTopProducts, productController.getAllProducts);

router.route("/product-stats").get(productController.getProductStats);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadProductImages,
    productController.uploadProductImagesToFirebase,
    productController.addProduct
  );

router
  .route("/:id")
  .get(productController.getSpecificProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadProductImages,
    productController.uploadProductImagesToFirebase,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );

module.exports = router;
