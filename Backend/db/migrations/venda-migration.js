/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('venda', (table) => {
        table.increments ('id').primary();
        table.string('nome_cliente').notNullable().unique();
        table.decimal('total_venda', 6, 2).notNullable();
        table.decimal('lucro', 6, 2).notNullable();
        table.string('data_venda').notNullable();
        table.timestamps(true, true);
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropSchemaIfExists('venda');
  
};
