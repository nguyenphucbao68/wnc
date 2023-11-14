import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

const router = Router();

router.post('/login', async function (req, res, next) {
  try {
    const { username, password } = req.body;

    const result = await userModel.findByUsername(username);

    if (result === null) {
      return res.status(401).json({
        msg: 'Username does not exist',
      });
    }

    if (result.password !== password) {
      return res.status(401).json({
        msg: 'Password does not match',
      });
    }
    const token = jwt.sign(
      {
        username: result.username ?? '',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({
      msg: 'User logged in',
      accessToken: token,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

