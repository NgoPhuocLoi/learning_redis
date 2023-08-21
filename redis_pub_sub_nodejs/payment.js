const express = require("express");
const redis = require("redis");

const redisClient = redis.createClient();

redisClient
  .connect()
  .then(() => {
    console.log("Redis is connected!");
  })
  .catch((err) => {
    console.log("Error when connecting to Redis. Error :: " + err);
  });

const app = express();

redisClient.subscribe("ordersystem", (message) => {
  console.log("Message from payment service :: " + JSON.parse(message));
});

app.listen(3001, () => {
  console.log("Payment service is running on PORT 3001");
});
