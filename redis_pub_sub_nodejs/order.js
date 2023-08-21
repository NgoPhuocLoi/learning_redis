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

app.get("/order", async (req, res) => {
  const orders = [
    {
      id: 1,
      price: 20000,
    },
    {
      id: 2,
      price: 50000,
    },
  ];

  await redisClient.publish("ordersystem", JSON.stringify(orders));

  res.json({
    message: "Order successfully!",
  });
});

app.listen(3000, () => {
  console.log("Order service is running on PORT 3000");
});
