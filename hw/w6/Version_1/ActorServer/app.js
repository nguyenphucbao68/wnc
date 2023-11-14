import express from 'express';
import axios from 'axios';

import actorRouter from './routes/actor.route.js';

const app = express();
app.use(express.json());

app.get('/', function (req, res) {
  res.json({
    msg: 'hello from expressjs',
  });
});

app.use('/api/actor', actorRouter);

app.get('/api/film', async function (req, res) {
  const url = 'http://localhost:3002/api/films';
  const response = await axios.get(url);
  res.json(response.data);
});

app.post('/', function (req, res) {
  res.status(201).json({
    msg: 'data created',
  });
});

app.get('/err', function (req, res) {
  throw new Error('Error!');
});

app.use(function (req, res) {
  res.status(404).json({
    error: 'Endpoint not found.',
  });
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({
    error: 'Something wrong!',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log(`Sakila API is listening at http://localhost:${PORT}`);
});

