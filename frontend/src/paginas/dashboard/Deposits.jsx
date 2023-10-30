import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function Deposits() {
  const [categoriasComQuantidadeDeItens, setCategoriasComQuantidadeDeItens] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const produtosResponse = await axios.get("http://localhost:3000/produto"); // Substitua pela sua URL de produtos
        const categoriasResponse = await axios.get("http://localhost:3000/categoria"); // Substitua pela sua URL de categorias

        const produtos = produtosResponse.data;
        const categorias = categoriasResponse.data;

        const categoriasComQuantidade = categorias.map((categoria) => {
          const produtosDaCategoria = produtos.filter((produto) => produto.id_categoria === categoria.id);
          const quantidadeDeItens = produtosDaCategoria.reduce((total, produto) => total + (produto.quantidade || 0), 0);
          return { id: categoria.id, nome: categoria.nome, quantidadeDeItens };
        });

        setCategoriasComQuantidadeDeItens(categoriasComQuantidade);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  const columns = [
    { field: 'nome', headerName: 'Nome da Categoria', flex: 1 },
    { field: 'quantidadeDeItens', headerName: 'Quantidade de Itens', flex: 1, align: "center" },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={categoriasComQuantidadeDeItens} columns={columns} />
    </div>
  );
}

export default Deposits;
