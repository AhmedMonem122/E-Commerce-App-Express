const Category = require("../models/categoryModel");
const {
  getAll,
  getOne,
  addOne,
  updateOne,
  deleteOne,
  uploadImageToFirebase,
} = require("./handlerFactory");
const multer = require("multer");
const admin = require("../config/firebase");

// Initialize Cloud Storage and get a reference to the service
const storage = admin.storage().bucket();

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadCategoryImage = upload.single("image");

const uploadCategoryImageToFirebase = uploadImageToFirebase(
  "Categories",
  storage
);

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
  uploadCategoryImage,
  uploadCategoryImageToFirebase,
};
