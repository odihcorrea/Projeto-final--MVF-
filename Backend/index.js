const dbSetup = require('./db/db_setup'); //
const ProdutoModel = require('./db/model/produto-model');
const CategoriaModel = require('./db/model/categoria-model')
const ProdutoVendaModel = require('./db/model/produto-venda-model')
const VendaModel = require('./db/model/venda-model')
const express = require('express')
const cors = require('cors')
const ClienteModel = require('./db/model/cliente-model')

dbSetup();

//npx knex migrate:make --migrations-directory "./db/migrations" init

const app = express()

app.use(express.json());
app.use(cors({
  origin: '*'
}));

const port = 3000

//Tabela Produto

app.get('/produto/', async (req, res) => {
  try {
    const produto = await ProdutoModel.query();
    res.json(produto);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

app.get('/produto/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const produto = await ProdutoModel.query().findById(id);
    res.json(produto);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

app.post('/produto/cadastrar/', async (req, res) => {

  try {
      const produto = req.body;
  
      console.log(produto);
  
      const cat = await ProdutoModel.query().insert(produto);
  
      console.log(cat)
  
      res.send("produtos cadastrados com sucesso !");
      
    } catch (err) {
      res.status(500).json(err);
    }
  
  });

app.put('/produto/alterar/:id', async (req, res) => {

  try {
    const id = req.params.id;
    const produto = req.body;

    console.log(produto);

    await ProdutoModel.query().patch(produto)
    .where('nome', '=', `${produto.nome}`);
    // .where('nome', 'like', `%${material.nome}%`);
    // .where('nome', 'like', `{material.nome}`);;

    res.send("Material alterado com sucesso !");
    
  } catch (err) {
    res.status(500).json(err);
  }

});

app.delete('/produto/deletar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const produto = await ProdutoModel.query().deleteById(id);
    res.send("Material deletado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

// Tabela Categoria

app.get('/categoria/', async (req, res) => {
  try {
    const categoria = await CategoriaModel.query();
    res.json(categoria);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

app.get('/categoria/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = await CategoriaModel.query().findById(id);
    res.json(categoria);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

app.post('/categoria/cadastrar/', async (req, res) => {

  try {
      const categoria = req.body;
  
      console.log(categoria);
  
      const cat = await CategoriaModel.query().insert(categoria);
  
      console.log(cat)
  
      res.send("categoria cadastrada com sucesso !");
      
    } catch (err) {
      res.status(500).json(err);
    }
  
  });
  

app.put('/categoria/alterar/:id', async (req, res) => {

  try {
    const id = req.params.id;
    const categoria = req.body;

    console.log(categoria);

    await CategoriaModel.query().patch(categoria)
    .where('nome', '=', `${categoria.nome}`);
    // .where('nome', 'like', `%${material.nome}%`);
    // .where('nome', 'like', `{material.nome}`);;

    res.send("categoria alterada com sucesso !");
    
  } catch (err) {
    res.status(500).json(err);
  }

});

app.delete('/categoria/deletar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = await CategoriaModel.query().deleteById(id);
    res.send("categoria deletada com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

// Tabela Venda

app.get('/venda/', async (req, res) => {
  try {
    const venda = await VendaModel.query();
    res.json(venda);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

app.get('/venda/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const venda = await VendaModel.query().findById(id);
    res.json(venda);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

app.post('/venda/cadastrar/', async (req, res) => {

  try {
      const venda = req.body;
  
      console.log(venda);
  
      const cat = await VendaModel.query().insert(venda);
  
      console.log(cat)
  
      res.send("venda realizada com sucesso !");
      
    } catch (err) {
      res.status(500).json(err);
    }
  
  });
  

app.put('/venda/alterar/:id', async (req, res) => {

  try {
    const id = req.params.id;
    const venda = req.body;

    console.log(venda);

    await VendaModel.query().patch(venda)
    .where('nome', '=', `${venda.nome}`);
    // .where('nome', 'like', `%${material.nome}%`);
    // .where('nome', 'like', `{material.nome}`);;

    res.send("Venda alterada com sucesso !");
    
  } catch (err) {
    res.status(500).json(err);
  }

});

app.delete('/venda/deletar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const venda = await VendaModel.query().deleteById(id);
    res.send("Venda deletada com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})


// Tabela Clientes

app.get('/cliente/', async (req, res) => {
  try {
    const cliente = await ClienteModel.query();
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

app.get('/cliente/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const cliente = await ClienteModel.query().findById(id);
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

app.post('/cliente/cadastrar/', async (req, res) => {

  try {
      const cliente = req.body;
  
      console.log(cliente);
  
      const cat = await ClienteModel.query().insert(cliente);
  
      console.log(cat)
  
      res.send("cliente cadastrado com sucesso !");
      
    } catch (err) {
      res.status(500).json(err);
    }
  
  });
  

app.put('/cliente/alterar/:id', async (req, res) => {

  try {
    const id = req.params.id;
    const cliente = req.body;

    console.log(cliente);

    await ClienteModel.query().patch(cliente)
    .where('nome', '=', `${cliente.nome}`);
    // .where('nome', 'like', `%${material.nome}%`);
    // .where('nome', 'like', `{material.nome}`);;

    res.send("cliente alterado com sucesso !");
    
  } catch (err) {
    res.status(500).json(err);
  }

});

app.delete('/cliente/deletar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const cliente = await ClienteModel.query().deleteById(id);
    res.send("cliente deletado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})


/*
 * C - Create -> POST
 * R - Read -> GET
 * U - Update -> PUT
 * D - Delete -> Delete
*/



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})