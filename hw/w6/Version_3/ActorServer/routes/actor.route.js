import express from 'express';
import actorModel from '../models/actor.model.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, async function (req, res) {
  const list = await actorModel.findAll();
  res.json(list);
});

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const film = await actorModel.findById(id);
  if (film === null) {
    return res.status(204).end();
  }

  res.json(film);
});

router.post('/', async function (req, res) {
  const entity = req.body;
  const ids = await actorModel.add(entity);
  entity.actor_id = ids[0];
  res.status(201).json(entity);
});

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const n = await actorModel.del(id);
  res.json({
    affected: n,
  });
});

router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const actor = req.body;
  console.log('actor', id, actor);
  const n = await actorModel.patch(id, actor);
  res.json({
    affected: n,
  });
});

export default router;

