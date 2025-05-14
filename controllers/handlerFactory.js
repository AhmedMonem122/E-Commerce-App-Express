const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on product
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    const { page, limit } = req.query;

    const results = (await Model.find()).length;

    const currentPage = +page || 1;
    const numberOfPages = Math.ceil(results / (+limit || 40));

    const { collectionName } = Model.collection;

    res.status(200).json({
      status: "success",
      results,
      currentResults: doc.length,
      metadata: {
        currentPage,
        numberOfPages,
        limit: +limit || 40,
        prevPage: currentPage === 1 ? undefined : currentPage - 1,
        nextPage: currentPage >= numberOfPages ? undefined : currentPage + 1,
      },
      data: {
        [collectionName]: doc,
      },
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    const documentName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(
        new AppError(`There is no ${documentName} with that id!`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        [documentName]: doc,
      },
    });
  });

const addOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    const documentName = Model.modelName.toLowerCase();

    res.status(201).json({
      status: "success",
      data: {
        [documentName]: doc,
      },
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
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

    const documentName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(
        new AppError(`There is no ${documentName} with that id!`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        [documentName]: doc,
      },
    });
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    const documentName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(
        new AppError(`There is no ${documentName} with that id!`, 404)
      );
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// Upload image to Firebase Storage
const uploadImageToFirebase = (fileDest, storage) =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const file = req.file;

    const safeName = fileDest.slice(0, fileDest.length - 1).toLowerCase();
    const filename = `${fileDest}/${safeName}-${
      req.params[`${safeName}Id`] || ""
    }-${file.originalname}-${Date.now()}`;

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
    req.body.image = downloadURL;

    next();
  });

module.exports = {
  getAll,
  getOne,
  addOne,
  updateOne,
  deleteOne,
  uploadImageToFirebase,
};
