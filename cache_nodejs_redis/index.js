const express = require("express");
const redis = require("redis");

const redisClient = redis.createClient();
redisClient.connect().then(() => {
  console.log("Redis is connected!");
});
redisClient.on("error", () => {
  console.log("Error when connecting to redis!");
});

const MOCK_API = "https://jsonplaceholder.typicode.com/users";

const app = express();

app.get("/users", async (req, res) => {
  const email = req.query.email;
  try {
    const resspone = await fetch(MOCK_API + "?email=" + email);
    const data = await resspone.json();
    console.log("User successfully retrieved from the API");
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

app.get("/cached-users", async (req, res) => {
  const email = req.query.email;
  let user;
  console.log("Here");
  try {
    user = JSON.parse(await redisClient.get(email));
    if (!user) {
      const resspone = await fetch(MOCK_API + "?email=" + email);
      user = await resspone.json();
      await redisClient.setEx(email, 600, JSON.stringify(user));
    }
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

app.listen(5000, () => {
  console.log("Server is running on PORT 5000");
});
