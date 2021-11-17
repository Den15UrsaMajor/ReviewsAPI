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

const reviewsSchema = mongoose.Schema({

});
