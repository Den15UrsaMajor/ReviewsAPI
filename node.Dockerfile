FROM node:14

WORKDIR /src

COPY server /src

RUN npm install

EXPOSE 3887

CMD npm start