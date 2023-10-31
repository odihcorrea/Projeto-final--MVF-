import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Modal,
  Box,
  Snackbar,
  Stack,
  IconButton,
  Collapse,
  Alert,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import jsPDF from "jspdf";
import "jspdf-autotable";

const modalStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "40%",
  height: "100%",
  backgroundColor: "white",
  boxShadow: 24,
  p: 4,
  transform: "translateX(100%)",
  transition: "transform 5s",
};

const modalOpenStyle = {
  transform: "translateX(0)",
};

const Venda = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [openModalVenda, setOpenModalVenda] = useState(false);
  const [produtosAdicionados, setProdutosAdicionados] = useState([]);
  const [carrinhoTemporario, setCarrinhoTemporario] = useState([]); // Estado para o carrinho temporário
  const [camposHabilitados, setCamposHabilitados] = useState(true);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [groupedVendasRows, setGroupedVendasRows] = useState([]);
  const [camposHabilitadosDetalhes, setCamposHabilitadosDetalhes] =
    useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  const [openModalDetalhesVenda, setOpenModalDetalhesVenda] = useState(false);
  const [detalhesVenda, setDetalhesVenda] = useState(null);
  const [erroQuantidadeZero, setErroQuantidadeZero] = useState("");
  const [exibirErroQuantidadeZero, setExibirErroQuantidadeZero] =
    useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [open, setOpen] = useState(false);
  const today = new Date();
  const dia = today.getDate();
  const mes = today.getMonth() + 1; // O mês começa em 0
  const ano = today.getFullYear();

  const todays = `${ano}-${mes}-${dia}`;

  //recuperar arrays do banco

  function chamarSnackbar(severity, message) {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  }

  const handleClickSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const fetchVendas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/venda/"); // Substitua pela sua URL
      setVendas(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/produto/"); // Substitua pela sua URL
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cliente/"); // Substitua pela sua URL
      setClients(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpen = (date, client) => {
    setSelectedDate(date);
    setSelectedClient(client);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditar = () => {
    const detalhesTemporarios = _.cloneDeep(selectedVenda.rows).map(
      (detalhe) => ({
        nome: detalhe.nome,
        quantidade: detalhe.quantidade,
        precovenda: detalhe.precovenda,
        id_cliente: detalhe.id_cliente,
        datavenda: detalhe.datavenda,
        id_produto: detalhe.id_produto, // Deixe este campo se necessário
      })
    );
    setCamposHabilitadosDetalhes(true);
    // Alterar os rótulos e estilos dos botões conforme necessário
  };

  const handleSalvar = () => {
    // Desative o modo de edição
    setModoEdicao(false);

    // Envie as alterações ao servidor usando o Axios
    if (edicaoTemporaria) {
      axios
        .put(
          `/http://localhost:3000/venda/alterar/${edicaoTemporaria.id}`,
          edicaoTemporaria
        )
        .then((response) => {
          fetchVendas();
          console.log("Venda editada com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao editar a venda:", error);
        });
    }

    setCamposHabilitadosDetalhes(false);
    // Realizar a lógica de salvar as alterações, se necessário
  };

  const handleExcluirVendasDoCliente = async () => {
    try {
      if (selectedVenda) {
        const idCliente = selectedVenda.id_cliente;

        // Converter a data da venda para um objeto Date
        const dataVenda = new Date(selectedVenda.datavenda);

        // Filtrar as vendas a serem excluídas com base no cliente e na data da venda
        const vendasParaExcluir = vendas.filter(
          (venda) =>
            venda.id_cliente === idCliente &&
            new Date(venda.datavenda).getTime() === dataVenda.getTime()
        );

        // Realize uma solicitação de exclusão para cada venda a ser excluída
        const promises = vendasParaExcluir.map((venda) =>
          axios.delete(`http://localhost:3000/venda/deletar/${venda.id}`)
        );

        // Aguarde todas as solicitações de exclusão
        await Promise.all(promises);

        // Exclua com sucesso, você pode fazer algo, como fechar o modal
        handleCloseDetalhesVenda();
        fetchVendas(); // Atualize a lista de vendas após a exclusão
      }
    } catch (error) {
      console.error("Erro ao excluir vendas:", error);
    }
  };

  const handleGerarComprovante = (row, clients) => {
    const doc = new jsPDF();

    // Centralize o título "Comprovante de Venda"
    doc.setFontSize(16); // Defina o tamanho da fonte para 14 (altere conforme necessário)
    doc.text("Comprovante de Venda", 105, 15, null, null, "center");

    // Formate a data para DD/MM/AAAA
    const dataVenda = new Date(row.datavenda);
    const formattedData = `${dataVenda.getDate()}/${
      dataVenda.getMonth() + 1
    }/${dataVenda.getFullYear()}`;

    // Encontre o nome do cliente com base no id_cliente, verificando se clients é uma array válida
    const cliente = clients.find((client) => client.id === row.id_cliente);
    const nomeCliente = cliente ? cliente.nome : "Cliente não encontrado";

    doc.setFontSize(12); // Defina o tamanho da fonte para 14 (altere conforme necessário)
    doc.text(`Data da Venda: ${formattedData}`, 15, 32);
    doc.text(`Cliente: ${nomeCliente}`, 15, 40);

    // Crie uma tabela com os detalhes das vendas
    const data = row.rows.map((detalhe) => [
      detalhe.nome,
      detalhe.quantidade,
      `R$ ${Number(detalhe.precovenda).toFixed(2)}`, // Converta para número antes de chamar toFixed
      `R$ ${(detalhe.quantidade * Number(detalhe.precovenda)).toFixed(2)}`, // Converta para número antes de chamar toFixed
    ]);

    doc.autoTable({
      startY: 50,
      head: [["Produto", "Quantidade", "Preço de Venda", "Total"]],
      body: data,
    });

    // Calcule a soma dos totais
    const total = row.rows.reduce((acc, detalhe) => {
      return acc + detalhe.quantidade * Number(detalhe.precovenda); // Converta para número antes de somar
    }, 0);

    const pdfWidth = doc.internal.pageSize.width; // Largura do PDF
    const tableWidth = doc.autoTable.previous.finalY; // Largura da tabela
    const totalX = pdfWidth - tableWidth + 21; // Posição x para alinhar à direita

    // Exiba o total no final da tabela
    doc.text(
      `Total: R$ ${total.toFixed(2)}`,
      totalX,
      doc.autoTable.previous.finalY + 20
    );

    // Salve o PDF
    doc.save("Comprovante_de_Venda.pdf");

    chamarSnackbar("success", "Fazendo Download");
  };

  const handleCancelar = () => {
    setModoEdicao(false);
    setCamposHabilitadosDetalhes(false);
    // Restaurar os valores originais dos campos, se necessário
  };

  const handleOpenVenda = () => {
    setOpenModalVenda(true);
  };

  const handleCloseVenda = () => {
    setOpenModalVenda(false);
    setCarrinhoTemporario([]);
    setCamposHabilitados(true);
  };

  const handleCancelarVenda = () => {
    setCarrinhoTemporario([]);
    setCamposHabilitados(true);
    setOpenModalVenda(false);
  };

  const handleCloseDetalhesVenda = () => {
    setOpenModalDetalhesVenda(false);
    setModoEdicao(false);
    setCamposHabilitadosDetalhes(false);
  };

  const handleOpenDetalhesVenda = (venda) => {
    setDetalhesVenda(venda);
    setOpenModalDetalhesVenda(true);
  };

  useState(() => {
    setSelectedDate(todays);
  }, []);

  const handleProdutosAdicionados = () => {
    setProdutosAdicionados((nome = ""), (quantidade = ""), (precovenda = ""));
  };

  function generateUniqueId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  const addProduto = () => {
    if (selectedDate && selectedProduct && quantity > 0) {
      const product = products.find((p) => p.id === selectedProduct);

      if (product) {
        if (product.quantidade === 0) {
          setErroQuantidadeZero("Este produto está fora de estoque.");
          setExibirErroQuantidadeZero(true);
          return; // Impede a adição do produto com quantidade zero
        }

        const novoProduto = {
          id: generateUniqueId(),
          id_cliente: selectedClient,
          datavenda: selectedDate,
          nome: product.nome,
          quantidade: quantity,
          precovenda: product.precovenda,
          id_produto: product.id,
        };

        setCarrinhoTemporario([...carrinhoTemporario, novoProduto]);

        if (carrinhoTemporario.length === 0) {
          setCamposHabilitados(false);
        }

        setQuantity(1);
        setOpen(false);

        // Limpar o erro se houver
        setErroQuantidadeZero("");
        setExibirErroQuantidadeZero(false);
      }
    }
  };

  const handleRetornarVendas = (selected) => {
    const groupVendasArray = groupVendas(selected); // Suponha que você já tenha chamado a função groupVendas

    const idDesejado = selected.id; // Substitua pelo ID desejado

    const grupoDesejado = groupVendasArray.find(
      (grupo) => grupo.id === idDesejado
    );

    if (grupoDesejado) {
      // Aqui, grupoDesejado conterá o grupo de vendas com o ID correspondente
      console.log(grupoDesejado);
    } else {
      // Se o grupo não for encontrado, você pode lidar com isso aqui
      console.log("Grupo não encontrado.");
    }
  };

  const desfazerVenda = async (vendaParaExcluir) => {
    try {
      if (!vendaParaExcluir) {
        console.error("Venda inválida para exclusão.");
        return;
      }

      // Obtém a data da venda e o cliente da venda selecionada
      const { datavenda, id_cliente, rows } = vendaParaExcluir;

      // Filtra as vendas a serem excluídas com base na data da venda e no cliente
      const vendasParaExcluir = vendas.filter(
        (venda) =>
          venda.datavenda === datavenda && venda.id_cliente === id_cliente
      );

      // Verifica se há vendas a serem excluídas
      if (vendasParaExcluir.length === 0) {
        console.error("Nenhuma venda encontrada para exclusão.");
        return;
      }

      const promisesExclusao = vendasParaExcluir.map((venda) =>
        axios.delete(`http://localhost:3000/venda/deletar/${venda.id}`)
      );

      await Promise.all(promisesExclusao);

      // Crie um objeto para rastrear as alterações no estoque de produtos
      const alteracoesEstoque = {};

      const arrays = vendasParaExcluir.reduce((array, objeto) => {
        array.push([objeto.id, objeto.id_produto, objeto.quantidade]);
        return array;
      }, []);

      arrays.map((e) => {
        const idProduto = e[1];
        const quantidadeVendida = e[2];

        console.log(idProduto);

        const product = products.find((p) => p.id === idProduto);

        console.log(product);
        // Atualize a quantidade disponível no estoque
        product.quantidade += quantidadeVendida;

        // Envie a atualização para o servidor
        return axios.put(
          `http://localhost:3000/produto/alterar/${product.id}`,
          product
        );
      });

      // Exclua com sucesso, você pode fazer algo, como fechar o modal
      handleCloseDetalhesVenda();
      chamarSnackbar("success", "Venda excluída");

      // Atualize a lista de vendas após a exclusão
      fetchVendas();
    } catch (error) {
      console.error("Erro ao excluir vendas:", error);
      chamarSnackbar("danger", "Erro ao excluir venda");
    }
  };

  const addSale = () => {
    if (selectedDate && selectedClient && carrinhoTemporario.length > 0) {
      const produtosParaAtualizar = []; // Array para armazenar products a serem atualizados no banco de dados

      // Vamos percorrer o carrinho temporário e preparar as atualizações
      for (const produtoVendido of carrinhoTemporario) {
        // Encontre o produto no banco de dados pelo ID
        const product = products.find(
          (p) => p.id === produtoVendido.id_produto
        );

        if (product) {
          if (produtoVendido.quantidade > product.quantidade) {
            // Quantidade insuficiente no estoque, não é possível realizar a venda
            console.log(`Quantidade insuficiente para ${product.nome}`);
            continue; // Pule para o próximo produto
          }

          // Atualize a quantidade disponível no estoque
          const novaQuantidade = product.quantidade - produtoVendido.quantidade;
          product.quantidade = novaQuantidade;

          // Adicione o produto à lista de products para atualizar no banco de dados
          produtosParaAtualizar.push(product);

          // Outras ações após a venda, se necessário
          // ...
        }
      }

      // Agora, vamos iterar pelos products a serem atualizados e enviar solicitações de atualização
      const promises = produtosParaAtualizar.map((produtoAtualizado) => {
        return axios.put(
          `http://localhost:3000/produto/alterar/${produtoAtualizado.id}`,
          produtoAtualizado
        );
      });

      // Use Promise.all para esperar que todas as solicitações de atualização sejam concluídas
      Promise.all(promises)
        .then((responses) => {
          // Todas as atualizações de estoque foram bem-sucedidas
          console.log("Estoque atualizado com sucesso!");

          // Aqui você pode adicionar o código para enviar a venda ao servidor
          const carrinhoParaEnviar = carrinhoTemporario.map((produto) => {
            const { id, ...produtoParaEnviar } = produto;
            return produtoParaEnviar;
          });
          axios
            .post("http://localhost:3000/venda/cadastrar", carrinhoParaEnviar) // Substitua pela URL correta
            .then((response) => {
              // Lidar com a resposta do servidor, se necessário
              console.log("Venda adicionada com sucesso!", response.data);
              chamarSnackbar("success", "Venda Realizada");

              fetchVendas();
            })
            .catch((error) => {
              // Lidar com erros, se houver
              console.error("Erro ao adicionar a venda:", error);
            });

          // Limpar carrinho temporário
          setCarrinhoTemporario([]);

          // Habilitar os campos novamente
          setCamposHabilitados(true);

          setOpenModalVenda(false);

          chamarSnackbar("success", "Venda Realizada");
        })
        .catch((errors) => {
          // Lidar com erros, se houver
          console.error("Erro ao atualizar o estoque:", errors);
          chamarSnackbar("danger", "Erro");
        });
    }
  };

  const removeProdutoDoCarrinho = (produtoId) => {
    // Filtra os products que não correspondem ao ID do produto a ser removido
    const novoCarrinho = carrinhoTemporario.filter(
      (produto) => produto.id !== produtoId
    );
    setCarrinhoTemporario(novoCarrinho);
  };

  const handleExcluirLinha = (linhaId) => {
    // Faça uma cópia das linhas atuais, excluindo a linha com o ID fornecido
    const novasLinhas = selectedVenda.rows.filter(
      (linha) => linha.id !== linhaId
    );

    // Atualize o estado com as novas linhas
    setSelectedVenda({ ...selectedVenda, rows: novasLinhas });
  };

  const calculateTotal = () => {
    return carrinhoTemporario.reduce(
      (total, sale) => total + sale.quantidade * sale.precovenda,
      0
    );
  };

  const calculateTotalDetalhes = () => {
    return selectedVenda.rows.reduce(
      (total, sale) => total + sale.quantidade * sale.precovenda,
      0
    );
    {
    }
  };

  const groupedSales = {};

  vendas.forEach((sale) => {
    const key = `${sale.datavenda}-${sale.id_cliente}`; // Combine data and client ID to create a unique key
    if (!groupedSales[key]) {
      groupedSales[key] = {
        datavenda: sale.datavenda,
        id_cliente: sale.id_cliente,
        products: [],
      };
    }
    groupedSales[key].products.push(sale);
  });

  const groupVendas = (vendas) => {
    const groupedVendas = {};

    vendas.forEach((venda) => {
      const key = `${venda.datavenda}-${venda.id_cliente}`;

      if (!groupedVendas[key]) {
        groupedVendas[key] = {
          id: generateUniqueId(),
          datavenda: venda.datavenda,
          id_cliente: venda.id_cliente,
          rows: [],
        };
      }

      // Adicione a venda ao grupo apropriado
      groupedVendas[key].rows.push(venda);
    });

    // Converta o objeto de grupos em uma matriz de objetos
    const groupedVendasArray = Object.values(groupedVendas);

    // Agora você pode dar console.log no groupedVendasArray
    console.log(groupedVendasArray);

    return groupedVendasArray;
  };

  // Chame a função para obter o array de grupos
  const groupedVendasArray = groupVendas(vendas);

  // Agora você tem o groupedVendasArray disponível para impressão no console
  console.log(groupedVendasArray);

  const groupedVendas = groupVendas(vendas);

  return (
    <Container>
      <Grid container justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleOpenVenda}>
          Realizar Venda
        </Button>
      </Grid>
      <Modal open={openModalVenda} onClose={handleCloseVenda}>
        <Paper
          sx={{
            ...modalStyle,
            ...(openModalVenda && modalOpenStyle),
          }}
        >
          <Typography className="mb-4 text-danger text-center">
            Adicionar Venda
          </Typography>

          <Box
            display={"flex"}
            justifyItems={"center"}
            justifyContent={"space-between"}
          >
            <TextField
              className="mr-3"
              fullWidth
              type="date"
              label="Data da Venda"
              defaultValue={selectedDate}
              onChange={(e) => {
                if (camposHabilitados) {
                  setSelectedDate(e.target.value);
                }
              }}
              disabled={!camposHabilitados} // Desabilita o campo se camposHabilitados for falso
            />

            <FormControl fullWidth>
              <InputLabel id="select-client-label">Cliente</InputLabel>
              <Select
                labelId="select-client-label"
                id="select-client"
                value={selectedClient}
                onChange={(e) => {
                  if (camposHabilitados) {
                    setSelectedClient(e.target.value);
                  }
                }}
                disabled={!camposHabilitados} // Desabilita o campo se camposHabilitados for falso
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


          </Box>

          <Box
            display={"flex"}
            justifyItems={"center"}
            justifyContent={"space-between"}
            className="my-3"
          >
            <FormControl fullWidth>
              <InputLabel id="select-product-label">Produto</InputLabel>
              <Select
                labelId="select-product-label"
                id="select-product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              className="ml-3"
              type="number"
              label="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Box>
          <Button
            fullWidth
            variant="contained"
            className="bg-primary"
            onClick={addProduto}
          >
            Adicionar Produto
          </Button>

          <Box
            display={"flex"}
            justifyItems={"center"}
            justifyContent={"space-between"}
          >
            <div style={{ height: 400, width: "100%", marginTop: 20 }}>
              <DataGrid
                rows={carrinhoTemporario} // Replace with your data source
                columns={[
                  {
                    field: "nome",
                    headerName: "Produto",
                    width: 260,
                  },
                  {
                    field: "quantidade",
                    headerName: "Quantidade",
                    width: 100,
                  },
                  {
                    field: "precovenda",
                    headerName: "Preço (R$)",
                    width: 100,
                  },
                  {
                    field: "excluir",
                    headerName: "Excluir",
                    width: 100,
                    renderCell: (params) => (
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => removeProdutoDoCarrinho(params.row.id)}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </Box>
          <Typography
            variant="h5"
            component="h3"
            style={{ marginTop: 20, textAlign: "right" }}
          >
            Total: R${calculateTotal().toFixed(2)}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            className="bg-success mt-5"
            onClick={addSale}
          >
            Finalizar Venda
          </Button>
          <Button
            fullWidth
            variant="contained"
            className="bg-danger mt-3"
            onClick={handleCancelarVenda}
          >
            Cancelar Venda
          </Button>
        </Paper>
      </Modal>

      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid
          rows={groupedVendas}
          columns={[
            {
              field: "datavenda",
              headerName: "Data da Venda",
              width: 350,
              valueGetter: (params) => {
                // Formate a data
                const date = new Date(params.row.datavenda);
                return format(date, "dd/MM/yyyy");
              },
            },
            {
              field: "id_cliente",
              headerName: "Cliente",
              width: 350,
              valueGetter: (params) => {
                // Recupere o nome do cliente com base no id_cliente
                const cliente = clients.find(
                  (client) => client.id === params.row.id_cliente
                );
                return cliente ? cliente.nome : "Cliente não encontrado";
              },
            },
            {
              field: "gerarComprovante",
              headerName: "Comprovante",
              width: 180,
              renderCell: (params) => {
                const handleButtonClick = (event) => {
                  event.stopPropagation(); // Impede a propagação do evento
                  handleGerarComprovante(params.row, clients);
                };
                return (
                  <button className="btn" onClick={handleButtonClick}>
                    <ReceiptLongIcon />
                  </button>
                );
              },
            },
          ]}
          onRowClick={(params) => {
            const groupVendasArray = groupVendas(vendas); // Suponha que você já tenha chamado a função groupVendas

            const idDesejado = params.row.id; // Substitua pelo ID desejado

            const grupoDesejado = groupVendasArray.find(
              (grupo) => grupo.id === idDesejado
            );

            if (grupoDesejado) {
              // Aqui, grupoDesejado conterá o grupo de vendas com o ID correspondente
              console.log(grupoDesejado);
            } else {
              // Se o grupo não for encontrado, você pode lidar com isso aqui
              console.log("Grupo não encontrado.");
            }

            setSelectedVenda(params.row); // Define a venda selecionada
            setOpenModalDetalhesVenda(true);
          }}
          isRowSelectable={(params) => false}
          isRowGrouping={true}
          groupField="datavenda"
          autoGroupColumnDef={{
            headerName: "Data da Venda",
            field: "datavenda",
            cellRenderer: "agGroupCellRenderer",
          }}
        />
      </div>

      <Modal open={openModalDetalhesVenda} onClose={handleCloseDetalhesVenda}>
        <Paper
          sx={{
            ...modalStyle,
            ...(openModalDetalhesVenda && modalOpenStyle),
          }}
        >
          <Typography className="mb-4 text-danger text-center">
            Detalhes da Venda
          </Typography>

          {selectedVenda && (
            <div>
              {/* Aqui você pode renderizar os detalhes da venda selecionada */}
              <Box
                display={"flex"}
                justifyItems={"center"}
                justifyContent={"space-between"}
              >
                <TextField
                  disabled
                  className="mr-3"
                  fullWidth
                  type="date"
                  label="Data da Venda"
                  defaultValue={format(
                    new Date(selectedVenda.datavenda),
                    "yyyy-MM-dd"
                  )}
                  onChange={(e) => {
                    if (camposHabilitados) {
                      setSelectedDate(e.target.value);
                    }
                  }}
                />

                <FormControl disabled={!modoEdicao} fullWidth>
                  <InputLabel id="select-client-label">Cliente</InputLabel>
                  <Select
                    labelId="select-client-label"
                    id="select-client"
                    value={selectedVenda.id_cliente}
                    onChange={(e) => {
                      if (camposHabilitados) {
                        setSelectedClient(e.target.value);
                      }
                    }}
                    disabled
                  >
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box
                display={"flex"}
                justifyItems={"center"}
                justifyContent={"space-between"}
                className="my-3"
              >
                <FormControl disabled={!modoEdicao} fullWidth>
                  <InputLabel id="select-product-label">Produto</InputLabel>
                  <Select
                    labelId="select-product-label"
                    id="select-product"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  disabled={!modoEdicao}
                  className="ml-3"
                  type="number"
                  label="Quantidade"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Box>
              <Button
                fullWidth
                variant={modoEdicao ? "contained" : "disabled"}
                className={
                  modoEdicao ? "bg-primary" : "bg-secondary text-light"
                }
                onClick={addProduto}
              >
                Adicionar Produto
              </Button>

              <Box
                display={"flex"}
                justifyItems={"center"}
                justifyContent={"space-between"}
              >
                <div style={{ height: 400, width: "100%", marginTop: 20 }}>
                  <DataGrid
                    rows={
                      modoEdicao ? edicaoTemporaria.rows : selectedVenda.rows
                    }
                    columns={[
                      {
                        field: "nome",
                        headerName: "Produto",
                        width: 200,
                      },
                      {
                        field: "quantidade",
                        headerName: "Quantidade",
                        width: 100,
                        align: "right",
                      },
                      {
                        field: "precovenda",
                        headerName: "Preço de Venda",
                        width: 100,
                        align: "right",
                      },

                      // Outros campos relevantes
                    ]}
                  />
                </div>
              </Box>
              <Typography
                variant="h5"
                component="h3"
                style={{ marginTop: 20, textAlign: "right" }}
              >
                Total: R${calculateTotalDetalhes().toFixed(2)}
              </Typography>

              {/* Outros detalhes da venda, se necessário */}
            </div>
          )}
          <Button
            fullWidth
            variant="contained"
            className={"bg-danger mt-3"}
            onClick={() => desfazerVenda(selectedVenda)}
          >
            Excluir venda
          </Button>
        </Paper>
      </Modal>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Stack>
      {exibirErroQuantidadeZero && (
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={exibirErroQuantidadeZero}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={"warning"}
              sx={{ width: "100%" }}
            >
              {erroQuantidadeZero}
            </Alert>
          </Snackbar>
        </Stack>
      )}
    </Container>
  );
};

export default Venda;
