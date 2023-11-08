## Requirements

1. Nodejs
2. NPM
3. MySQL: using XAMPP (https://www.apachefriends.org/download.html)
4. Library: Express, Knex, Mysql, Dotenv, Jwt, Bcryptjs, cors

## Steps

### Setup Environment

1. Setup Library

  - Jwt: `yarn add jsonwebtoken`
  - Bcryptjs: `yarn add bcryptjs`
  - Cors: `yarn add cors`
  - Dotenv: `yarn add dotenv`

2. Create .env file and use dotenv

  - .env file

```env
JWT_SECRET=mysecretkey
```
  - app.js
```js
import dotenv from 'dotenv';

dotenv.config();
```

  - Use cors

```js
import cors from 'cors';

app.use(cors());
```

### Create and use authentication API

1. Create Login API
  - /routes/auth.route.js

```js
import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
```

2. Use Login API
  - /app.js

```js
import authRouter from './routes/auth.route.js';

app.use('/auth', authRouter);
```

### Create Verify Token Middleware and use it in API
1. Create Verify Token Middleware
  - /middlewares/verifyToken.js

```js
import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }
}
```

2. Use Verify Token Middleware
  - /routes/actor.route.js

```js
import verifyToken from '../middlewares/verifyToken.js';

router.get('/', verifyToken, async function (req, res) {
  const list = await actorModel.findAll();
  res.json(list);
});

```


