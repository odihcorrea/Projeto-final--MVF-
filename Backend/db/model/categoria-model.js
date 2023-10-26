const { Model } = require('objection');

class Categoria extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'categoria';
  }

  static get idColumn() {
    return 'id';
  }

  static get nomeColumn() {
    return 'nome';
  }

  static get relationMappings() {
    const Produto = require('../model/produto-model');
    return {
      produto: {
        relation: Model.HasManyRelation,
        modelClass: Produto,
        
          join: {
            from: 'categoria.id',
            to: 'produto.id_categoria'
        }
      }
    };
  }

}

module.exports = Categoria;
