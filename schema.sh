mongoimport -d sdc -c photos --type csv --file /seed/reviews_photos.csv --headerline
mongoimport -d sdc -c reviews --type csv --file /seed/reviews.csv --headerline
mongoimport -d sdc -c characteristics --type csv --file /seed/characteristics.csv --headerline
mongoimport -d sdc -c characteristic_reviews --type csv --file /seed/characteristic_reviews.csv --headerline