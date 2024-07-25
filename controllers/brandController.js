const Brand = require("../models/brandModel");
const {
  getAll,
  getOne,
  addOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

const getAllBrands = getAll(Brand);
const getSpecificBrand = getOne(Brand);
const addBrand = addOne(Brand);
const updateBrand = updateOne(Brand);
const deleteBrand = deleteOne(Brand);

module.exports = {
  getAllBrands,
  getSpecificBrand,
  addBrand,
  updateBrand,
  deleteBrand,
};
