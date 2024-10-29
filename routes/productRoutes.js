const express = require("express");
const productController = require("../controllers/productController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.addProduct);

router
  .route("/:id")
  .get(productController.getSpecificProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
