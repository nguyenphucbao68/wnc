## Requirements

1. Nodejs
2. NPM
3. MySQL: XAMPP (https://www.apachefriends.org/download.html)
4. Library: Express, Knex, Mysql

## Steps

### Setup Environment

1. Setup Database (XAMPP - MySQL)

   - Link Download: https://www.apachefriends.org/download.html
   - **Start Server**: Manage Servers Tab -> Enable MYSQL Database + Apache Web Server (to use phpmyadmin)

2. Setup Nodejs

   - Link Download: https://nodejs.org/en/download/
   - **Check Version**: `node -v`

3. Setup NPM + Yarn

   - Link Download: https://www.npmjs.com/get-npm
   - **Check Version**: `npm -v`
   - **Install Yarn**: `npm install -g yarn`
   - **Check Version**: `yarn -v`

### Import Database in phpmyadmin

1.  Download https://drive.google.com/file/d/1xkaolV5jiKbnfe35_0_bXmcsPD9OjvDH/view
2.  Enter phpmyadmin: http://localhost/phpmyadmin/
3.  Create new database: "**wnc**" with _utf8mb4_general_ci_
4.  Enter database **"wnc" -> Import -> Choose file -> Choose your file -> Go**

### Setup Project Template

1. Package.json

```json
{
  "type": "module",
  "name": "sakilaapi",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.3",
    "express-async-errors": "^3.1.1",
    "knex": "^1.0.3",
    "morgan": "^1.10.0",
    "mysql": "^2.18.1"
  }
}
```

2. app.js

- initialize app

```js
import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.json({
    msg: 'hello from expressjs',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Sakila API is listening at http://localhost:${PORT}`);
});
```

- error handling

```js
...
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
...
```

- Initialize DB

```js (utils/db.js)
import knex from 'knex';

export default knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '1234566',
    database: 'wnc',
  },
  pool: { min: 0, max: 10 },
});
```

### Add CRUD API - actor

1. Model

generic.model.js

```js
import db from '../utils/db.js';

export default function (table_name, id_field) {
  return {
    findAll() {
      return db(table_name);
    },

    async findById(id) {
      const list = await db(table_name).where(id_field, id);
      if (list.length === 0) {
        return null;
      }

      return list[0];
    },

    add(entity) {
      return db(table_name).insert(entity);
    },

    del(id) {
      return db(table_name).where(id_field, id).del();
    },

    patch(id, entity) {
      return db(table_name).where(id_field, id).update(entity);
    },
  };
}
```

actor.model.js

```js
import generate from './generic.model.js';

export default generate('actor', 'actor_id');
```

2. Routes

- initialize Routers

```js
import express from 'express';
import actorModel from '../models/actor.model.js';

const router = express.Router();
```

- List all actors

```js
router.get('/', async function (req, res) {
  const list = await actorModel.findAll();
  res.json(list);
});
```

- Get actor by id

```js
router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const film = await actorModel.findById(id);
  if (film === null) {
    return res.status(204).end();
  }

  res.json(film);
});
```

- Add new actor

```js
router.post('/', async function (req, res) {
  const entity = req.body;
  const ids = await actorModel.add(entity);
  entity.actor_id = ids[0];
  res.status(201).json(entity);
});
```

- Delete an actor

```js
router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const n = await actorModel.del(id);
  res.json({
    affected: n,
  });
});
```

- Update an actor

```js
router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const film = req.body;
  const n = await actorModel.patch(id, film);
  res.json({
    affected: n,
  });
});
```

## Video
