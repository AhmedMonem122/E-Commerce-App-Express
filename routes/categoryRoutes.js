const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.addCategory);

router
  .route("/:id")
  .get(categoryController.getSpecificCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
