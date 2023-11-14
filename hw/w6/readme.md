## Requirements

1. Nodejs
2. NPM
3. MySQL: using XAMPP (https://www.apachefriends.org/download.html)
4. Library: Express, Knex, Mysql, Dotenv, Jwt
5. Using 2 server: 1 for Actor, 1 for Film

## Steps

### Setup Environment

1. Setup Library

  - Jwt: `yarn add jsonwebtoken` (only add in server actor)
  - Dotenv: `yarn add dotenv`

2. Create .env file and use dotenv

  - Create a .env file with the JWT secret key.
  - In the app.js file, configure the app to use the dotenv package to load environment variables.

```env
JWT_SECRET=mysecretkey
```
  - app.js
```js
import dotenv from 'dotenv';

dotenv.config();
```

## Actor Server
### Create and use authentication API

1. Create Login API
  - In the auth.route.js file, define a route for handling user login.
  - Extract email and password from the request body.
  - Sign a JWT token with the user information and send it in the response.


```js
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
```

1. Use Login API
  - In the app.js file, import the authRouter and use it under the /auth route.

```js
import authRouter from './routes/auth.route.js';

app.use('/auth', authRouter);
```

### Create Verify Token Middleware and use it in API
1. Create Verify Token Middleware
  - Create a middleware (verifyToken.js) for verifying the JWT token in the request headers.
  - If the token is valid, decode it and attach the user information to the request (req.user).
  - If the token is not present or invalid, return a 401 Unauthorized response.

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
  - In the actor.route.js file, use the verifyToken middleware to protect the / route. The middleware ensures that a valid token is present before allowing access to the actor data.

```js
import verifyToken from '../middlewares/verifyToken.js';

router.get('/', verifyToken, async function (req, res) {
  const list = await actorModel.findAll();
  res.json(list);
});

```


