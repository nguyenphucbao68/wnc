import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { registerValidator } from './../validations/auth.js';

const router = Router();

router.post('/register', async function (req, res, next) {
  try {
    const { error } = registerValidator(req.body);
    if (error) {
      return res.status(400).json(error);
    }

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      email,
      password: hashedPassword,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      msg: 'User created',
      token,
    });
  } catch (err) {
    next(err);
  }
});

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

