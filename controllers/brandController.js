const Brand = require("../models/brandModel");
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

const uploadBrandImage = upload.single("image");

const uploadBrandImageToFirebase = uploadImageToFirebase("Brands", storage);

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
  uploadBrandImage,
  uploadBrandImageToFirebase,
};
