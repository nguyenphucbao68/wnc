import express, { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = {
      email,
      password,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      msg: 'User logged in',
      token,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
