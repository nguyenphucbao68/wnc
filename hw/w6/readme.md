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
JWT_SECRET=myJWTSecret
SECRET_KEY=mySecretKey
```
  - app.js
```js
import dotenv from 'dotenv';

dotenv.config();
```

## Apply Access Token to Actor Server
### Create and use authentication API

1. Create Login API
  - In the auth.route.js file, define a route for handling user login.
  - Extract username and password from the request body.
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

    if (decoded.username) {
      next();
    }
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

## Apply Secret Key to Film Server

### Create Verify Secret Middleware (Using crypto to hash) and use it in API

1. Create Verify Secret Middleware
  - Create a middleware (verifySecret.js) for verifying the secret key in the request headers.
  
  - Check Headers: Ensures that the request headers contain 'time' and 'token' values. If not, it returns a 401 Unauthorized response.

  - Check Request Time: Verifies if the time provided in the headers is within a reasonable window (60 seconds) of the server's current time. If the time is too old, it returns a 401 Unauthorized response.
   
  - Generate and Compare Hash: Computes a hash using the request URL, client's time, and the server's secret key. It then compares this hash with the 'token' provided in the headers. If they don't match, it returns a 401 Unauthorized response.

  - If all checks pass, it calls the next() function to proceed to the next middleware.

```js
import crypto from 'crypto';

export default function verifySecret(req, res, next) {
  const clientTime = req.headers['time'];
  const clientHash = req.headers['token'];

  if (!clientTime || !clientHash) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - parseInt(clientTime, 10) > 60) {
    return res.status(401).json({
      error: 'Request time expired',
    });
  }

  const serverHash = crypto
    .createHash('sha256')
    .update(req.url + clientTime + process.env.SECRET_KEY)
    .digest('hex');

  if (serverHash !== clientHash) {
    return res.status(401).json({
      error: 'Invalid token',
    });
  }

  next();
}
```

1. Use Verify Secret Middleware
  - This piece of code applies the verifySecret middleware to the / route of the film server. This means that any request to this route must go through the verifySecret middleware first, ensuring that a valid secret key is present before allowing access to the film data.

```js
import verifySecret from '../middlewares/verifySecret.js';

router.get('/', verifySecret, async function (req, res) {
  const list = await filmModel.findAll();
  res.json(list);
});

```

## Apply Secret Key to Actor Server

### Using Crypto to create hash and send to Film Server

1. Create hash and send to Film Server
  - In the film.route.js file.
  
  - Calculating Client Hash: Creates a hash using the request URL, current time, and the secret key. This hash is then included in the request headers.

  - Sending Request to Film Server: Makes a GET request to the film server with the calculated hash and current time included in the headers. If the request is successful, it returns the film data; otherwise, it returns a 401 Unauthorized response.

```js
import express from 'express';
import axios from 'axios';
import verifyToken from '../middlewares/verifyToken.js';
import crypto from 'crypto';

const router = express.Router();

router.get('/', verifyToken, async function (req, res) {
  const url = 'http://localhost:3002/api/films';
  const currentTime = Math.floor(Date.now() / 1000);

  const clientHash = crypto
    .createHash('sha256')
    .update(req.url + currentTime + process.env.SECRET_KEY)
    .digest('hex');

  try {
    const response = await axios.get(url, {
      headers: {
        time: currentTime,
        token: clientHash,
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
```

## Apply Refresh Token to Actor Server

### Create common function to update and find refresh token

  - Update Refresh Token: The updateRefreshToken function updates the refresh token for a given username in the database.

  - Find Refresh Token: The findByRefreshToken function finds a user based on their refresh token in the database

1. Update refresh token
  - In the user.model.js file, create a function for updating the refresh token of a user.

```js
export const updateRefreshToken = async (username, refreshToken) => {
  return await db('user')
    .where('username', username)
    .update({ refresh_token: refreshToken });
};
```

2. Find refresh token
  - In the user.model.js file, create a function for finding the refresh token of a user.

```js
export const findByRefreshToken = async (refreshToken) => {
  const list = await db('user').where('refresh_token', refreshToken);
  if (list.length === 0) {
    return null;
  }

  return list[0];
};
```

### Update Login API to return refresh token

1. Update Login API
  - In the auth.route.js file, Login API Update: After a successful login, the API now returns an access token with a short validity (1 second) and a refresh token with a longer validity (7 days). It also updates the refresh token in the database.

```js
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
```

2. Create Refresh Token API
  - In the auth.route.js file.
  - refresh Token API: This API is designed for generating a new access token using a refresh token. It verifies the refresh token, and if valid, returns a new access token and refresh token with updated expiration times. It also updates the refresh token in the database.

```js
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
```
3. User using expired access token to call API
  - Expired Access Token Middleware: This middleware checks if the provided access token is expired. If it is, it returns a 401 Unauthorized response. The user can then use the refresh token to obtain a new access token.

  - Refresh Token Process: If the refresh token is valid, it returns a new access token and refresh token. If the refresh token is invalid, it returns a 401 Unauthorized response.


