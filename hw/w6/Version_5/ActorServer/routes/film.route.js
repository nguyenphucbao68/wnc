import express from 'express';
import axios from 'axios';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, async function (req, res) {
  const url = 'http://localhost:3002/api/films';
  try {
    const response = await axios.get(url, {
      headers: {
        secret: process.env.SECRET_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
    });
  }
});

export default router;

