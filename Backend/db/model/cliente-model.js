const { Model } = require('objection');

class Cliente extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'clientes';
  }

  static get idColumn() {
    return 'id';
  }

  static get nomeColumn() {
    return 'nome';
  }

  static get datanascimentoColumn() {
    return 'datanascimento';
  }

  static get cpfColumn() {
    return 'cpf';
  }

  static get enderecoColumn() {
    return 'endereco';
  }

  static get contatoColumn() {
    return 'contato';
  }

  static get relationMappings() {
    const Venda = require('../model/venda-model');
    return {
      venda: {
        relation: Model.HasManyRelation,
        modelClass: Venda,
        
          join: {
            from: 'clientes.id',
            to: 'vendas.id_cliente'
        }
      }
    };
  }

}

module.exports = Cliente;
