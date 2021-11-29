import http from 'k6/http';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3887/reviews/';
  const payload = JSON.stringify({
    product_id: 1000,
    rating: 3,
    summary: 'great',
    body: 'I love this product more than my own mother',
    recommend: true,
    name: 'JoeBeans',
    email: 'beanpatrol@fartfactory.com',
    photos: ['https://www.recipetineats.com/wp-content/uploads/2014/05/Homemade-Heinz-Baked-Beans_0.jpg', 'https://www.splenda.ca/wp-content/themes/bistrotheme/assets/recipe-images/slow-cooker-baked-beans.jpg'],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}
