const { Model } = require('objection');

class Produto extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'produtos';
  }

  static get idColumn() {
    return 'id';
  }

  static get nomeColumn() {
    return 'nome';
  }

  static get descricaoColumn() {
    return 'descricao';
  }

  static get quantidadeColumn() {
    return 'quantidade';
  }

  static get precocompraColumn() {
    return 'precocompra';
  }

  static get precovendaColumn() {
    return 'precovenda';
  }

  static get dataCompraColumn() {
    return 'datacompra';
  }

  static get imagemColumn() {
    return 'imagem';
  }

  static get relationMappings() {
    const Categoria = require('./categoria-model');

    return {
        categoria: {
          relation: Model.BelongsToOneRelation,
          modelClass: Categoria,
        join: {
          from : 'produto.id_categoria',
          to: 'categoria.id'
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
            from: 'produtos.id',
            to: 'produto_venda.id_produto'
        }
      }
    };
  }

}

module.exports = Produto;
