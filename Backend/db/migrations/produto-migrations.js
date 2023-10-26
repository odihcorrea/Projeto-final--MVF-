/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('produto', (table) => {
          table.increments('id').primary().unsigned();
          table.string('nome').notNullable().unique();
          table.integer('quantidade').notNullable();
          table.decimal('precocompra', 6, 2).notNullable();
          table.decimal('precovenda', 6, 2).notNullable();
          table.string('data_compra').notNullable();
          table.string('data_venda');
          table.string('imagem').notNullable().unique();
          table.integer('categoria_id').notNullable().references('id')
          .inTable('categoria');
          table.timestamps(true, true);
      })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
      return knex.schema
          .dropSchemaIfExists('produto'); 
  };
  