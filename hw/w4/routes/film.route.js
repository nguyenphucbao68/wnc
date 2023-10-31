import express from "express";
import filmModel from "../models/film.model.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/", async function (req, res) {
  const list = await filmModel.findAll();
  res.json(list);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const info = {
    level: "info",
    message: "api get film id",
    meta: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
    },
  };
  const film = await filmModel.findById(id);
  if (film === null) {
    info.meta.response = "not found";
    info.meta.statusCode = 204;
    return res.status(204).end();
  }
  info.meta.responseData = film
  info.meta.statusCode = 200
  logger.log(info);
  res.json(film);
});

router.post("/", async function (req, res) {
  let film = req.body;
  const ret = await filmModel.add(film);

  film = {
    film_id: ret[0],
    ...film,
  };
  res.status(201).json(film);
});

router.delete("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const n = await filmModel.del(id);
  res.json({
    affected: n,
  });
});

router.patch("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const film = req.body;
  const n = await filmModel.patch(id, film);
  res.json({
    affected: n,
  });
});

export default router;
