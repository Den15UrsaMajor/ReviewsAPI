import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 2000,
  duration: '60s',
};

export default function () {
  http.get('http://localhost:3887/reviews/?product_id=986143');
  sleep(1);
}
