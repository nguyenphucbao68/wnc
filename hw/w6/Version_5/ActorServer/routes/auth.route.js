import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import userModel, {
  updateRefetchToken,
  findByRefetchToken,
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

    const refetchToken = jwt.sign(
      {
        username: result.username ?? '',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    await updateRefetchToken(username, refetchToken);

    res.status(200).json({
      msg: 'User logged in',
      accessToken: token,
      refetchToken: refetchToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/token', async function (req, res, next) {
  try {
    const { refetchToken } = req.body;

    const result = await findByRefetchToken(refetchToken);

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
        expiresIn: '1h',
      }
    );

    const newRefetchToken = jwt.sign(
      {
        username: result.username ?? '',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    await updateRefetchToken(result.username, refetchToken);

    res.status(200).json({
      msg: 'Refetch token success',
      accessToken: token,
      refetchToken: newRefetchToken,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

