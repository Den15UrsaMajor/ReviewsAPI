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
  summary: Text,
  recommended: Boolean,
  response: Text,
  body: Text,
  date: Date,
  reviewer_name: Text,
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
  url: Text,
});

const reviewsSchema = mongoose.Schema({
  _id: ObjectID,
  product_id: Number,
  results: [resultsSchema],
  characteristics: [characteristicsSchema],
  photos: [photosSchema],
});
