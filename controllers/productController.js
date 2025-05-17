const Product = require("../models/productModel");
const {
  getAll,
  getOne,
  addOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");
const multer = require("multer");
// const firebaseAdminConfig = require("../config/firebaseConfig");
// const admin = require("firebase-admin");
const admin = require("../config/firebase");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// const deleteAllFirebaseApps = () => {
//   if (admin.apps.length > 0) {
//     admin.apps.forEach((app) => {
//       app
//         .delete()
//         .then(() => console.log(`Deleted app: ${app.name}`))
//         .catch((error) =>
//           console.error(`Error deleting app: ${app.name}`, error)
//         );
//     });
//   } else {
//     console.log("No Firebase apps are initialized.");
//   }
// };

// deleteAllFirebaseApps();

//Initialize a firebase application
// admin.initializeApp({
//   credential: admin.credential.cert(firebaseAdminConfig),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
// });

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

const uploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

// const uploadProductImagesToFirebase = catchAsync(async (req, res, next) => {
//   if (!req.files.imageCover || !req.files.images) {
//     return next();
//   }

//   const imageCoverFile = req.files.imageCover[0];
//   const imagesFiles = req.files.images;

//   const imageCoverStorageRef = ref(
//     storage,
//     `Products/product-${req.params.productId ? req.params.productId : ""}-${
//       imageCoverFile.originalname
//     }-cover-${Date.now()}`
//   );

//   // Create file metadata including the content type
//   const metadata = {
//     contentType: imageCoverFile.mimetype,
//   };

//   const imageCoverUploadTask = uploadBytesResumable(
//     imageCoverStorageRef,
//     imageCoverFile.buffer,
//     metadata
//   );

//   const imageCoverDownloadURL = await new Promise((resolve, reject) => {
//     imageCoverUploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         // Observe state change events such as progress, pause, and resume
//         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log("Upload is " + progress + "% done");
//         switch (snapshot.state) {
//           case "paused":
//             console.log("Upload is paused");
//             break;
//           case "running":
//             console.log("Upload is running");
//             break;
//         }
//       },
//       (error) => {
//         // Handle unsuccessful uploads
//         reject(error);
//         next(new AppError(error.message, 400));
//       },
//       () => {
//         // Handle successful uploads on complete
//         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//         getDownloadURL(imageCoverUploadTask.snapshot.ref).then(
//           (downloadURL) => {
//             resolve(downloadURL);
//           }
//         );
//       }
//     );
//   });

//   // Upload additional images
//   const imagesDownloadURLs = await Promise.all(
//     imagesFiles.map((file, i) => {
//       const imagesStorageRef = ref(
//         storage,
//         `Products/product-${req.params.productId ? req.params.productId : ""}-${
//           file.originalname
//         }-${Date.now()}-${i + 1}`
//       );

//       const fileMetadata = {
//         contentType: file.mimetype,
//       };

//       const uploadTask = uploadBytesResumable(
//         imagesStorageRef,
//         file.buffer,
//         fileMetadata
//       );

//       return new Promise((resolve, reject) => {
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress =
//               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log(`Image ${i + 1} upload is ` + progress + "% done");
//           },
//           (error) => {
//             reject(error);
//             next(new AppError(error.message, 400));
//           },
//           () => {
//             getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
//           }
//         );
//       });
//     })
//   );

//   req.body.imageCover = imageCoverDownloadURL;
//   req.body.images = imagesDownloadURLs;
//   next();
// });

const uploadProductImagesToFirebase = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  // Handle the cover image upload
  const imageCoverFile = req.files.imageCover[0];
  const imageCoverFilename = `Products/product-${req.params.productId || ""}-${
    imageCoverFile.originalname
  }-cover-${Date.now()}`;
  const imageCoverRef = storage.file(imageCoverFilename);

  // Set metadata
  const metadata = {
    contentType: imageCoverFile.mimetype,
  };

  // Upload the cover image file buffer to Firebase Storage
  await imageCoverRef.save(imageCoverFile.buffer, { metadata });

  // Get the download URL for the cover image
  const imageCoverDownloadURL = `https://firebasestorage.googleapis.com/v0/b/${
    process.env.FIREBASE_STORAGE_BUCKET
  }/o/${encodeURIComponent(imageCoverFilename)}?alt=media`;

  // Upload additional images and get download URLs
  const imagesDownloadURLs = await Promise.all(
    req.files.images.map(async (file, i) => {
      const imageFilename = `Products/product-${req.params.productId || ""}-${
        file.originalname
      }-${Date.now()}-${i + 1}`;
      const imageRef = storage.file(imageFilename);

      const fileMetadata = {
        contentType: file.mimetype,
      };

      // Upload each image file buffer to Firebase Storage
      await imageRef.save(file.buffer, { metadata: fileMetadata });

      // Return the download URL for each image
      return `https://firebasestorage.googleapis.com/v0/b/${
        process.env.FIREBASE_STORAGE_BUCKET
      }/o/${encodeURIComponent(imageFilename)}?alt=media`;
    })
  );

  // Attach URLs to the request body for further processing
  req.body.imageCover = imageCoverDownloadURL;
  req.body.images = imagesDownloadURLs;

  next();
});

const getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 1 } },
    },
    {
      $group: {
        _id: null,
        numProducts: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

const aliasTopProducts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "title,price,ratingsAverage,description,imageCover";
  next();
};

const filterByBrands = (req, res, next) => {
  if (req.params.brandId) {
    req.query.brand = req.params.brandId;
  }
  next();
};
const filterByCategories = (req, res, next) => {
  if (req.params.categoryId) {
    req.query.category = req.params.categoryId;
  }
  next();
};

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
  aliasTopProducts,
  getProductStats,
  filterByBrands,
  filterByCategories,
};
