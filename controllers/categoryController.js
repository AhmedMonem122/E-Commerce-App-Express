const Category = require("../models/categoryModel");
const {
  getAll,
  getOne,
  addOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

const getAllCategories = getAll(Category);
const getSpecificCategory = getOne(Category);
const addCategory = addOne(Category);
const updateCategory = updateOne(Category);
const deleteCategory = deleteOne(Category);

module.exports = {
  getAllCategories,
  getSpecificCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
