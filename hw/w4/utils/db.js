import knex from 'knex';

export default knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    database: 'sakila',
  },
  pool: { min: 0, max: 10 },
});
