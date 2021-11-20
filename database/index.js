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
  summary: String,
  body: String,
  recommend: Boolean,
  date: Date,
  reviewer_name: String,
  reviewer_email: String,
  helpfulness: Number,
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

// Fetch data on characteristics for transformation as part of the meta data
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
// TODO: finish these functions
const saveToReviews = async (data) => {
  const doc = new Review();
  doc._id = mongoose.Types.ObjectId();
  doc.product_id = data.product_id;
  doc.rating = data.rating;
  doc.summary = data.summary;
  doc.body = data.body;
  doc.recommend = data.recommend;
  doc.reviewer_name = data.name;
  doc.reviewer_email = data.email;
  // doc.save();
};
const saveToPhotos = (data) => {
  console.log('data in photos ', data);
};
const saveToCharacteristics = (reviews) => {
  console.log('data from chars ', reviews);
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
