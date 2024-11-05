const Product = require("../models/productModel");
const {
  getAll,
  getOne,
  addOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");
const multer = require("multer");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const firebaseConfig = require("../config/firebaseConfig");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//Initialize a firebase application
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

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

const uploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

const uploadProductImagesToFirebase = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  const imageCoverFile = req.files.imageCover[0];
  const imagesFiles = req.files.images;

  const imageCoverStorageRef = ref(
    storage,
    `Products/product-${req.params.productId ? req.params.productId : ""}-${
      imageCoverFile.originalname
    }-cover-${Date.now()}`
  );

  // Create file metadata including the content type
  const metadata = {
    contentType: imageCoverFile.mimetype,
  };

  const imageCoverUploadTask = uploadBytesResumable(
    imageCoverStorageRef,
    imageCoverFile.buffer,
    metadata
  );

  const imageCoverDownloadURL = await new Promise((resolve, reject) => {
    imageCoverUploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
        next(new AppError(error.message, 400));
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(imageCoverUploadTask.snapshot.ref).then(
          (downloadURL) => {
            resolve(downloadURL);
          }
        );
      }
    );
  });

  // Upload additional images
  const imagesDownloadURLs = await Promise.all(
    imagesFiles.map((file, i) => {
      const imagesStorageRef = ref(
        storage,
        `Products/product-${req.params.productId ? req.params.productId : ""}-${
          file.originalname
        }-${Date.now()}-${i + 1}`
      );

      const fileMetadata = {
        contentType: file.mimetype,
      };

      const uploadTask = uploadBytesResumable(
        imagesStorageRef,
        file.buffer,
        fileMetadata
      );

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Image ${i + 1} upload is ` + progress + "% done");
          },
          (error) => {
            reject(error);
            next(new AppError(error.message, 400));
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
          }
        );
      });
    })
  );

  req.body.imageCover = imageCoverDownloadURL;
  req.body.images = imagesDownloadURLs;
  next();
});

const getAllProducts = getAll(Product);
const getSpecificProduct = getOne(Product, { path: "reviews" });
const addProduct = addOne(Product);
const updateProduct = updateOne(Product);
const deleteProduct = deleteOne(Product);

module.exports = {
  getAllProducts,
  getSpecificProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  uploadProductImagesToFirebase,
};
