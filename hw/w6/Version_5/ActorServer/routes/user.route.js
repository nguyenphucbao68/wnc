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

  try {
    const existingUser = await userModel.findByUsername(entity.username);

    if (existingUser?.username === entity.username) {
      return res.status(400).json({
        msg: 'Username already exists',
      });
    }

    const ids = await userModel.add(entity);
    entity.user_id = ids[0];
    res.status(201).json(entity);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
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

