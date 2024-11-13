const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
// const firebaseAdminConfig = require("../config/firebaseConfig");
// const admin = require("firebase-admin");
const admin = require("../config/firebase");

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

const uploadUserPhoto = upload.single("photo");

// const uploadUserPhotoToFirebase = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   const file = req.file;

//   const storageRef = ref(
//     storage,
//     `Users/user-${req.user.id}-${file.originalname}-${Date.now()}`
//   );

//   // Create file metadata including the content type
//   const metadata = {
//     contentType: req.file.mimetype,
//   };

//   const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);

//   uploadTask.on(
//     "state_changed",
//     (snapshot) => {
//       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log("Upload is " + progress + "% done");
//       switch (snapshot.state) {
//         case "paused":
//           console.log("Upload is paused");
//           break;
//         case "running":
//           console.log("Upload is running");
//           break;
//       }
//     },
//     (error) => {
//       next(new AppError(error.message, 400));
//     },
//     () => {
//       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         req.body.photo = downloadURL;
//         next();
//       });
//     }
//   );
// });

const uploadUserPhotoToFirebase = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const file = req.file;

  const safeUserName = req.user.name
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  const filename = `Users/${safeUserName}-${req.user.id}/user-${req.user.id}-${
    file.originalname
  }-${Date.now()}`;

  const fileRef = storage.file(filename); // Create a file reference in the storage bucket

  // Set metadata
  const metadata = {
    contentType: file.mimetype,
  };

  // Upload the file buffer
  await fileRef.save(file.buffer, { metadata });

  // Get the download URL
  const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${
    process.env.FIREBASE_STORAGE_BUCKET
  }/o/${encodeURIComponent(filename)}?alt=media`;
  req.body.photo = downloadURL;

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for password updates! Please use /updateMyPassword instead.",
        400
      )
    );

  const filteredBody = filterObj(req.body, "name", "email", "photo");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getAllUsers,
  updateMe,
  deleteMe,
  uploadUserPhoto,
  uploadUserPhotoToFirebase,
};
