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
  photos: [photosSchema],
  characteristics: {},
});

const Review = mongoose.model('Review', resultsSchema);
const Photo = mongoose.model('Photo', photosSchema);
const Characteristic = mongoose.model('Characteristic', characteristicsSchema);

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

const findOneProduct = (id) => Review.find({ product_id: id });

module.exports.getProductReviews = getProductReviews;
module.exports.getMetaReviews = getMetaReviews;
module.exports.findOneProduct = findOneProduct;
