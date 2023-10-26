// Update with your config settings.
const { knexSnakeCaseMappers } = require('objection');
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'projetofinal',
      user:     'postgres',
      password: '123456',
      port: '5433'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    },
    ...knexSnakeCaseMappers
  },
};
