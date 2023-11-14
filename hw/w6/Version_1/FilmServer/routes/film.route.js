import express from 'express';
import filmModel from '../models/film.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await filmModel.findAll();
  res.json(list);
})

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const film = await filmModel.findById(id);
  if (film === null) {
    return res.status(204).end();
  }

  res.json(film);
})

router.post('/', async function (req, res) {
  let film = req.body;
  const ret = await filmModel.add(film);

  film = {
    film_id: ret[0],
    ...film
  }
  res.status(201).json(film);
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const n = await filmModel.del(id);
  res.json({
    affected: n
  });
})

router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const film = req.body;
  const n = await filmModel.patch(id, film);
  res.json({
    affected: n
  });
})

export default router;