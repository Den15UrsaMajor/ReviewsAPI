const bodyParser = require('body-parser');
const express = require('express');
const mongo = require('../database/index.js');

const app = express();
app.use(express.static('hr-den15-project-catwalk/client/dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const test = async () => {
  const resultsArray = await mongo.findOne();
  const photosArray = await mongo.findPhotos();
  const charsArray = await mongo.findChars();
  const obj = {
    product_id: 1,
    results: resultsArray,
    photos: photosArray,
    characteristics: charsArray,
  };
  console.log('hey buddy ', obj);
};

test();

app.listen(3887, () => {
  console.log('listening on port 3887');
});
