const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const metrics = require("./src/metrics/metrics");

const { AppError, handleError } = require("./src/utils/errorHandler");
const { connectToDb } = require("./src/config/database");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/metrics", metrics);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes. Réessayez plus tard.",
});
app.use(limiter);

connectToDb();

const userRoutes = require("./src/routes/userRoutes");

app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.use((req, res) => {
  res.status(404).send("Route non trouvée");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
