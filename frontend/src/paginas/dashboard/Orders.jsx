import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { format } from "date-fns";

function Orders() {
  const [vendas, setVendas] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/venda");
        setVendas(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de vendas:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/produto");
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  const getValorTotal = (row) => {
    const product = products.find((p) => p.id === row.id_produto);
    return product ? product.precovenda * row.quantidade : 0;
  };

  const getLucro = (row) => {
    const product = products.find((p) => p.id === row.id_produto);
    return product
      ? (product.precovenda - product.precocompra) * row.quantidade
      : 0;
  };

  const formatData = (date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };

  const formatCurrency = (value) => {
    return `R$ ${value}`;
  };

  const rows = vendas.map((venda) => {
    const valorTotal = getValorTotal(venda);
    const lucro = getLucro(venda);
    return {
      ...venda,
      dataFormatada: formatData(venda.datavenda),
      valorTotal: `R$ ${valorTotal.toFixed(2)}`, // Adicione o "R$" aqui
      lucro: `R$ ${lucro.toFixed(2)}`, // Adicione o "R$" aqui
    };
  });

  // Agregando os valores totais e lucros totais por data
  const dataAgregada = rows.reduce((agregado, venda) => {
    const dataFormatada = venda.dataFormatada;

    if (!agregado[dataFormatada]) {
      agregado[dataFormatada] = {
        dataFormatada,
        valorTotal: 0,
        lucroTotal: 0,
      };
    }

    const valorTotal = parseFloat(
      venda.valorTotal.replace("R$ ", "").replace(",", ".")
    );
    const lucro = parseFloat(venda.lucro.replace("R$ ", "").replace(",", "."));

    agregado[dataFormatada].valorTotal += valorTotal;
    agregado[dataFormatada].lucroTotal += lucro;

    return agregado;
  }, {});

  // Convertendo o objeto em um array
  const dataAgregadaArray = Object.values(dataAgregada).map((data, index) => ({
    ...data,
    id: index,
  }));

  // Defina as colunas da tabela
  const columns = [
    { field: "dataFormatada", headerName: "Data da Venda", width: 400, },
    {
      field: "valorTotal",
      headerName: "Valor Total",
      width: 350,
      renderCell: (e) => {
        return `R$ ${e.value},00`;
      },
    },
    {
      field: "lucroTotal",
      headerName: "Lucro Total",
      width: 350,
      renderCell: (e) => {
        return `R$ ${e.value},00`;
      },
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={dataAgregadaArray}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.dataFormatada}
      />
    </div>
  );
}

export default Orders;
