import express from 'express';
import userModel from '../models/user.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await userModel.findAll();
  res.json(list);
});

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const user = await userModel.findById(id);
  if (user === null) {
    return res.status(204).end();
  }

  res.json(user);
});

router.post('/', async function (req, res) {
  const entity = req.body;
  const ids = await userModel.add(entity);
  entity.user_id = ids[0];
  res.status(201).json(entity);
});

router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const actor = req.body;
  const n = await userModel.patch(id, actor);
  res.json({
    affected: n,
  });
});

export default router;

