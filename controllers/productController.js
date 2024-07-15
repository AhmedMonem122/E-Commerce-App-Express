const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/APIFeatures");

const getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  const { page, limit } = req.query;

  const results = (await Product.find()).length;

  const currentPage = +page || 1;
  const numberOfPages = Math.ceil(results / (+limit || 40));

  res.status(200).json({
    status: "success",
    results,
    currentResults: products.length,
    metadata: {
      currentPage,
      numberOfPages,
      limit: +limit || 40,
      prevPage: currentPage === 1 ? undefined : currentPage - 1,
      nextPage: currentPage >= numberOfPages ? undefined : currentPage + 1,
    },
    data: {
      products,
    },
  });
});

const getSpecificProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("There is no product with that id!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const addProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      updatedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    return next(new AppError("There is no product with that id!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product: updatedProduct,
    },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return next(new AppError("There is no product with that id!", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getAllProducts,
  getSpecificProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
