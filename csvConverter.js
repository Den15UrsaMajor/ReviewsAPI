const csvtojson = require('csvtojson');

// csvtojson()
//   .fromFile('./reviewCSV/50Reviews.csv')
//   .then((csvdata) => {
//     console.log('Reviews ', csvdata);
//   });

csvtojson()
  .fromFile('./reviewCSV/50Photos.csv')
  .then((csvdata) => {
    console.log('Photos ', csvdata);
  });

// `csvtojson()
//   .fromFile('./reviewCSV/50Characteristics.csv')
//   .then((csvdata) => {
//     console.log('Characteristics ', csvdata);
//   });
