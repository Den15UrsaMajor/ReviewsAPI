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

const resultsSchema = mongoose.Schema({
  _id: ObjectID,
  product_id: Number,
  rating: Number,
  summary: String,
  recommended: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
});

const characteristicsSchema = mongoose.Schema({
  _id: ObjectID,
  product_id: Number,
  review_id: Number,
  fit: Number,
  length: Number,
  comfort: Number,
  quality: Number,
});

const photosSchema = mongoose.Schema({
  _id: ObjectID,
  review_id: Number,
  url: String,
});

const reviewsSchema = mongoose.Schema({
  _id: ObjectID,
  product_id: Number,
  results: [resultsSchema],
  characteristics: [characteristicsSchema],
  photos: [photosSchema],
});

// * TODO * //
// set up your mongoose model(s) //

const Review = mongoose.model('Review', resultsSchema);
const Photo = mongoose.model('Photo', photosSchema);
const Characteristic = mongoose.model('Characteristic', characteristicsSchema);
const Result = mongoose.model('Result', resultsSchema);

const getProductReviews = (ID) => Review.aggregate([
  { $match: { product_id: ID } },
  {
    $lookup: {
      from: 'photos',
      localField: 'review_id',
      foreignField: 'review_id',
      as: 'photos',
    },
  }]);

const getMetaReviews = (ID) => Characteristic.aggregate([
  { $match: { product_id: ID } },
  {
    $lookup: {
      from: 'characteristic_reviews',
      localField: 'id',
      foreignField: 'characteristic_id',
      as: 'values',
    },
  }]);

module.exports.getProductReviews = getProductReviews;
module.exports.getMetaReviews = getMetaReviews;
