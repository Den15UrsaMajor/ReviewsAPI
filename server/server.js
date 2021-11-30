/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
const express = require('express');
const path = require('path');
const mongo = require('./database/database.js');
const app = express();
app.use(express.static('../../hr-den15-project-catwalk/client/dist/'));
app.use(express.json());

// Get function for reviews/photos object
app.get('/reviews/', async (req, res) => {
  const { product_id } = req.query;
  const id = parseInt(product_id, 10);
  const data = await mongo.getProductReviews(id);
  for (let i = 0; i < data.length; i += 1) {
    data[i].date = Date(data[i].date);
  }
  res.send(data);
});
// Get function for reviews metadata
app.get('/reviews/meta/', async (req, res) => {
  const { product_id } = req.query;
  const id = parseInt(product_id, 10);
  const [data, reviews] = await Promise.all([mongo.getMetaReviews(id), mongo.findOneProduct(id)]);

  const metadata = {
    ratings: {},
    recommended: {
      true: 0,
      false: 0,
    },
    characteristics: {},
  };
  // populate ratings and recommendation totals
  reviews.forEach((fakeObject) => {
    // https://stackoverflow.com/questions/18710043/mongoose-mongodb-result-fields-appear-undefined-in-javascript
    const obj = fakeObject.toObject();
    const key = obj.rating;
    const bool = obj.recommend;

    if (!metadata.ratings[key]) {
      metadata.ratings[key] = 1;
    } else {
      metadata.ratings[key] += 1;
    }
    if (bool === true) {
      metadata.recommended.true += 1;
    } else if (bool === false) {
      metadata.recommended.false += 1;
    }
  });
  // populate characteristic reviews
  data.forEach((entry) => {
    const { name } = entry;
    const arr = [];
    let sum = 0;
    for (const char of entry.values) {
      arr.push(char.value);
    }
    for (const num of arr) {
      sum += num;
    }
    const average = sum / arr.length;
    if (!metadata.characteristics[name]) {
      metadata.characteristics[name] = {
        id: entry.id,
        value: average,
      };
    }
  });
  res.send(metadata);
});
// TODO: finish post and put
app.post('/reviews', async (req, res) => {
  const data = req.body;
  const { characteristics } = data;
  const { photos } = data;

  mongo.saveToReviews(data);
  if (photos) {
    mongo.saveToPhotos(photos);
  }
  mongo.saveToCharacteristics(characteristics);
  res.send('document saved');
});

app.listen(3887, () => {
  console.log('listening on port 3887');
});
