import express from "express";
import morgan from "morgan";

import categoryRouter from "./routes/category.route.js";
import filmRouter from "./routes/film.route.js";
import actorRouter from "./routes/actor.route.js";
import swagger from "./utils/swagger.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.get("/", function (req, res) {
  res.json({
    msg: "hello from expressjs",
  });
});

app.use("/api/categories", categoryRouter);
app.use("/api/films", filmRouter);
app.use("/api/actors", actorRouter);

// Serve swagger docs
swagger(app);

app.post("/", function (req, res) {
  res.status(201).json({
    msg: "data created",
  });
});

app.get("/err", function (req, res) {
  throw new Error("Error!");
});

app.use(function (req, res) {
  res.status(404).json({
    error: "Endpoint not found.",
  });
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({
    error: "Something wrong!",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Sakila API is listening at http://localhost:${PORT}`);
});
