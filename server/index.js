const keys = require("./keys");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.PG_USER,
  host: keys.PG_HOST,
  database: keys.PG_DATABASE,
  password: keys.PG_PASSWORD,
  port: keys.PG_PORT
});

const redisClient = redis.createClient({
  host: keys.REDIS_HOST,
  port: keys.REDIS_PORT,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

pgClient.on("error", () => console.log("Lost PG connection"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values(number INT)")
  .catch(err => console.log(err));

app.get("/", (_, res) => res.send("Hi"));

app.get("/values/all", async (_, res) => {
  const values = await pgClient.query("SELECT * FROM values ORDER BY number");
  res.send(values.rows);
});

app.get("/values/current", async (_, res) => {
  redisClient.hgetall("values", (_, values) => res.send(values));
});

app.post("/values", async (req, res) => {
  const { index } = req.body;
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }
  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: true });
});

app.listen(5000, () => console.log("Server is listening on 5000..."));
