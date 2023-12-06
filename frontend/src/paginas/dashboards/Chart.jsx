import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Container, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


function Chart() {
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

  const generateChartData = () => {
    const chartData = [];

    vendas.forEach((venda) => {
      try {
        // Verifica se a data é válida (pode variar dependendo do formato na sua base de dados)
        const dataVenda = format(new Date(venda.datavenda), "dd/MM/yyyy", { locale: ptBR });

        const totalPrecoVenda = products
          .filter((produto) => produto.id === venda.id_produto)
          .reduce((total, produto) => total + produto.precovenda, 0);

        chartData.push({
          dataVenda,
          totalPrecoVenda,
        });
      } catch (error) {
        console.error("Erro ao processar data:", error);
      }
    });

    return chartData;
  };

  return (
    <Grid item xs={12} md={8} lg={7}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 350,
        }}
      >
        <Container>
          <Typography variant="h6" gutterBottom>
            Vendas por Data
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={generateChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dataVenda" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
                }
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
                }
                labelFormatter={(label) => label}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalPrecoVenda"
                name="Total de Vendas"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Container>
      </Paper>
    </Grid>
  );
}

export default Chart;
