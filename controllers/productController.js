const Product = require("../models/productModel");
const {
  getAll,
  getOne,
  addOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

// Get All Products
// catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Product.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const products = await features.query;

//   const { page, limit } = req.query;

//   const results = (await Product.find()).length;

//   const currentPage = +page || 1;
//   const numberOfPages = Math.ceil(results / (+limit || 40));

//   res.status(200).json({
//     status: "success",
//     results,
//     currentResults: products.length,
//     metadata: {
//       currentPage,
//       numberOfPages,
//       limit: +limit || 40,
//       prevPage: currentPage === 1 ? undefined : currentPage - 1,
//       nextPage: currentPage >= numberOfPages ? undefined : currentPage + 1,
//     },
//     data: {
//       products,
//     },
//   });
// });

// Get Specific Product
// catchAsync(async (req, res, next) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return next(new AppError("There is no product with that id!", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       product,
//     },
//   });
// });

// Add Product
// catchAsync(async (req, res, next) => {
//   const newProduct = await Product.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       product: newProduct,
//     },
//   });
// });

// Update Product
// catchAsync(async (req, res, next) => {
//   const updatedProduct = await Product.findByIdAndUpdate(
//     req.params.id,
//     {
//       ...req.body,
//       updatedAt: Date.now(),
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (!updatedProduct) {
//     return next(new AppError("There is no product with that id!", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       product: updatedProduct,
//     },
//   });
// });

// Delete Product
// catchAsync(async (req, res, next) => {
//  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

//  if (!deletedProduct) {
//    return next(new AppError("There is no product with that id!", 404));
//  }

//  res.status(204).json({
//    status: "success",
//    data: null,
//  });
// });
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
