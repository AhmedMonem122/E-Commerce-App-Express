const express = require("express");
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const productRouter = require("./productRoutes");

const router = express.Router({ mergeParams: true });

router.use(
  "/:categoryId/products",
  productController.filterByCategories,
  productRouter
);

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.uploadCategoryImage,
    categoryController.uploadCategoryImageToFirebase,
    categoryController.addCategory
  );

router
  .route("/:id")
  .get(categoryController.getSpecificCategory)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.uploadCategoryImage,
    categoryController.uploadCategoryImageToFirebase,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.deleteCategory
  );

module.exports = router;
