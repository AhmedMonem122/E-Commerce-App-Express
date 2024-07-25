const Product = require("../models/productModel");
const {
  getAll,
  getOne,
  addOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

const getAllProducts = getAll(Product);
const getSpecificProduct = getOne(Product);
const addProduct = addOne(Product);
const updateProduct = updateOne(Product);
const deleteProduct = deleteOne(Product);

module.exports = {
  getAllProducts,
  getSpecificProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
