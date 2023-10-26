/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('produto_venda', function(table) {
        table.increments('id').primary()
        table
          .integer('venda_fk')
          .references('id')
          .inTable('venda')
        table
          .integer('produto_fk')
          .references('id')
          .inTable('produto')
      })  
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropSchemaIfExists('produto_venda');
  
};
