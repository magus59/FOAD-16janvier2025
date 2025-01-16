const express = require("express");
const client = require("prom-client");

const app = express();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Durée des requêtes HTTP en secondes",
  labelNames: ["status_code"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5, 10],
});

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({ status_code: res.statusCode });
  });
  next();
});

app.get("/", async (req, res) => {
  console.log("L'endpoint /metrics est actif !");
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app; 