const csvtojson = require('csvtojson');

csvtojson()
  .fromFile('./reviewCSV/50Reviews.csv')
  .then((csvdata) => {
    const data = JSON.stringify(csvdata);
    console.log('csvdata ', typeof (csvdata));
    console.log('data ', typeof (data));
  });
