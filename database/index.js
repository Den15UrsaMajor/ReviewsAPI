/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
const { ObjectID } = require('mongodb/node_modules/bson');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/reviewsAPI', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('connected successfully');
});

const characteristicsSchema = mongoose.Schema({
  _id: ObjectID,
  product_id: Number,
  id: Number,
});

const charSchema = mongoose.Schema({
  _id: ObjectID,
  id: Number,
  characteristic_id: Number,
  review_id: Number,
  value: Number,
});

const photosSchema = mongoose.Schema({
  _id: ObjectID,
  review_id: Number,
  url: String,
});

const resultsSchema = mongoose.Schema({
  _id: ObjectID,
  product_id: Number,
  rating: Number,
  date: Date,
  summary: String,
  body: String,
  recommend: { type: Boolean, default: false },
  reported: { type: Boolean, default: false },
  reviewer_name: String,
  reviewer_email: String,
  response: { type: String, default: null },
  helpfulness: Number,
  review_id: Number,
});

const Review = mongoose.model('Review', resultsSchema, 'reviews');
const Photo = mongoose.model('Photo', photosSchema, 'photos');
const Characteristic = mongoose.model('Characteristic', characteristicsSchema, 'characteristics');
const CharReview = mongoose.model('Characteristic Review', charSchema, 'characteristic_reviews');

// Fetch all reviews for a given product and attach any associated photos
const getProductReviews = (id) => Review.aggregate([
  { $match: { product_id: id } },
  {
    $lookup: {
      from: 'photos',
      localField: 'review_id',
      foreignField: 'review_id',
      as: 'photos',
    },
  }]);

// Fetch data on characteristics for transformation as part of the meta data\
// TODO handle for invalid search parameters
const getMetaReviews = (id) => Characteristic.aggregate([
  { $match: { product_id: id } },
  {
    $lookup: {
      from: 'characteristic_reviews',
      localField: 'id',
      foreignField: 'characteristic_id',
      as: 'values',
    },
  }]);
// Individual fetch functions
const findOneProduct = (id) => Review.find({ product_id: id });
const findOneCharacteristicSet = (id) => Characteristic.find({ product_id: id });
const findOnePhotoSet = (id) => Photo.find({ review_id: id });
const findCharacteristicReviews = (id) => CharReview.find({ characteristic_id: id });

// Post functions for different collections
/**
 * @TODO: finish these functions
*/
const saveToReviews = async (data) => {
  const last = await Review.find({}).sort({ review_id: -1 }).limit(1);
  const { review_id } = last[0];
  const date = Date.now();
  const doc = new Review();
  doc._id = mongoose.Types.ObjectId();
  doc.product_id = data.product_id;
  doc.review_id = review_id + 1;
  doc.rating = data.rating;
  doc.date = date;
  doc.summary = data.summary;
  doc.body = data.body;
  doc.recommend = data.recommend;
  doc.reviewer_name = data.name;
  doc.reviewer_email = data.email;

  doc.save();
};
const saveToPhotos = async (photos) => {
  const last = await Review.find({}).sort({ review_id: -1 }).limit(1);
  const { review_id } = last[0];
  for (let i = 0; i < photos.length; i += 1) {
    const doc = new Photo();
    doc._id = mongoose.Types.ObjectId();
    doc.id = i + 1,
    doc.review_id = review_id + 1,
    doc.url = photos[i];
    doc.save();
  }
};
const saveToCharacteristics = async (characteristics) => {
  const last = await CharReview.find({}).sort({ _id: -1 }).limit(1);

  let { id } = last[0];
  const keys = Object.keys(characteristics);
  keys.forEach((key) => {
    const doc = new CharReview();
    doc._id = mongoose.Types.ObjectId();
    doc.id = id += 1;
    doc.review_id = key;
    doc.value = characteristics[key];
    doc.save;
  });
};

module.exports.getProductReviews = getProductReviews;
module.exports.getMetaReviews = getMetaReviews;
module.exports.findOneProduct = findOneProduct;
module.exports.findOneCharacteristicSet = findOneCharacteristicSet;
module.exports.findOnePhotoSet = findOnePhotoSet;
module.exports.saveToReviews = saveToReviews;
module.exports.saveToPhotos = saveToPhotos;
module.exports.saveToCharacteristics = saveToCharacteristics;
module.exports.findCharacteristicReviews = findCharacteristicReviews;
