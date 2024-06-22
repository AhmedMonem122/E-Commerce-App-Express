const Product = require("../models/productModel");

const getAllProducts = async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
};

const addProduct = async (req, res, next) => {
  const { title } = req.body;

  const newProduct = await Product.create({ title });

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
};

module.exports = {
  getAllProducts,
  addProduct,
};
