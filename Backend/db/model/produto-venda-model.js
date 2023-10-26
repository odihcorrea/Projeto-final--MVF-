const { Model } = require('objection');

class ProdutoVenda extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'produto_venda';
  }

  static get id_vendaColumn() {
    return 'id_venda';
  }

  static get id_produtoColumn() {
    return 'id_produto';
  }


  static get relationMappings() {
    const Produto = require('./produto-model');

    return {
        produto: {
          relation: Model.BelongsToOneRelation,
          modelClass: Produto,
        join: {
          from : 'produtos.id_produtos',
          to: 'produto_venda.id'
        }
      },
    }
}

static get relationMappings() {
  const Venda = require('./categoria-model');

  return {
      venda: {
        relation: Model.BelongsToOneRelation,
        modelClass: Venda,
      join: {
        from : 'vendas.id_venda',
        to: 'produto_venda.id'
      }
    },
  }
}
}
module.exports = ProdutoVenda;
