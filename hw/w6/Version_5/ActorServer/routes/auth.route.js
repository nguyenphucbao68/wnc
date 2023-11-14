import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import userModel, {
  updateRefreshToken,
  findByRefreshToken,
} from '../models/user.model.js';

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
        expiresIn: '1s',
      }
    );

    const refreshToken = jwt.sign(
      {
        username: result.username ?? '',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    await updateRefreshToken(username, refreshToken);

    res.status(200).json({
      msg: 'User logged in',
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async function (req, res, next) {
  try {
    const { refreshToken } = req.body;

    const result = await findByRefreshToken(refreshToken);

    if (result === null) {
      return res.status(401).json({
        msg: 'Invalid refresh token',
      });
    }

    const token = jwt.sign(
      {
        username: result.username ?? '',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1m',
      }
    );

    const newRefreshToken = jwt.sign(
      {
        username: result.username ?? '',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    await updateRefreshToken(result.username, refreshToken);

    res.status(200).json({
      msg: 'Refetch token success',
      accessToken: token,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

