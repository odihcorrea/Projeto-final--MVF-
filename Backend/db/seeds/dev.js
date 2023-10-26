/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE "produto" CASCADE');

  await knex("produto").insert([
  {nome: 'Arroz', quantidade: 30, preco_unitario_compra: 2.5, preco_unitario_venda:6, data_compra: '24/09/2023', imagem: 'img', categoria_id: 1}
    
  ]);
}