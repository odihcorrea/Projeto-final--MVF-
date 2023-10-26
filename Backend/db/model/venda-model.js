const { Model } = require('objection');

class Venda extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'vendas';
  }

  static get idColumn() {
    return 'id';
  }

  static get nomeColumn() {
    return 'nome';
  }

  static get quantidadeColumn() {
    return 'quantidade';
  }

  static get precovendaColumn() {
    return 'precovenda';
  }

  static get datavendaColumn() {
    return 'datavenda';
  }

  static get relationMappings() {
    const Cliente = require('./cliente-model');

    return {
        cliente: {
          relation: Model.BelongsToOneRelation,
          modelClass: Cliente,
        join: {
          from : 'vendas.id_cliente',
          to: 'clientes.id'
        }
      },
    }
  }

  static get relationMappings() {
    const ProdutoVenda = require('../model/produto-venda-model');
    return {
      produtovenda: {
        relation: Model.HasManyRelation,
        modelClass: ProdutoVenda,
        
          join: {
            from: 'vendas.id',
            to: 'produto_venda.id_venda'
        }
      }
    };
  }

}

module.exports = Venda;
