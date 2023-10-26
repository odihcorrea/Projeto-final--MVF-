import React, { useState, useEffect } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Modal,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { AddCircleOutline as AddIcon } from "@mui/icons-material";
import { listProduto } from "../services/service";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Axios from "axios";

const modalStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "30%",
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

export default function Produto() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nome: "",
    descricao: "",
    quantidade: "",
    datacompra: null,
    precocompra: "",
    precovenda: "",
    id_categoria: "",
    imagem: "",
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await listProduto();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  const handleOpenModal2 = (product) => {
    setSelectedProduct(product);
    setModalOpen2(true);
  };

  const handleCloseModal2 = () => {
    setSelectedProduct(null);
    setModalOpen2(false);
    setNewProduct("");
  };

  const handleAddProduct = () => {
    Axios.post("http://localhost:3000/produto/cadastrar", newProduct)
      .then((response) => {
        console.log(response.data);
        handleCloseModal2();
      })
      .catch((error) => {
        console.log(error);
      });

    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/material/"); // Substitua pela sua URL
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }

      setNome("");
      setQuantidade("");
      setPrecoCompra("");
      setPrecoVenda("");
      setData("");
      setImagem("");
      setCategoria("");
    };

    // Adicione aqui a lógica para enviar os dados do novo produto para o servidor.
    // Por enquanto, apenas exibiremos os dados no console.
    console.log("Novo Produto:", newProduct);
    // Limpar o formulário após adicionar o produto.
    setNewProduct({
      nome: "",
      descricao: "",
      quantidade: "",
      datacompra: "",
      precocompra: "",
      precovenda: "",
      id_categoria: "",
      imagem: "",
    });
    handleCloseModal();
  };

  const columnsToShow = [
    { field: "nome", headerName: "Nome", width: 400 },
    {
      field: "quantidade",
      headerName: "Quantidade",
      width: 150,
      align: "right",
    },
    {
      field: "precocompra",
      headerName: "Preço de Compra",
      width: 150,
      align: "right",
    },
    {
      field: "precovenda",
      headerName: "Preço de Venda",
      width: 150,
      align: "right",
    },
    {
      field: "categoria",
      headerName: "Categoria",
      width: 250,
      align: "center",
    },
  ];

  function dateFormatter(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  const AdapterDay = ({ locale, ...rest }) => {
    return (
      <AdapterDay locale={locale} dateFormatter={dateFormatter} {...rest} />
    );
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          variant="outlined"
          label="Pesquisar por Nome"
          value={searchText}
          onChange={handleSearchTextChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon className="text-success" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal2()}
        >
          Adicionar Produto
        </Button>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredProducts}
          columns={columnsToShow}
          onRowClick={(params) => handleOpenModal(params.row)}
        />
      </div>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Paper
          sx={{
            ...modalStyle,
            ...(isModalOpen && modalOpenStyle),
          }}
        >
          {selectedProduct && (
            <div>
              <h2>{selectedProduct.nome}</h2>
              <p>Quantidade: {selectedProduct.quantidade}</p>
              <p>Preço de Compra: {selectedProduct.precocompra}</p>
              <p>Preço de Venda: {selectedProduct.precovenda}</p>
              <p>Categoria: {selectedProduct.categoria}</p>
              {/* Add other fields as needed */}
            </div>
          )}
        </Paper>
      </Modal>

      <Modal open={isModalOpen2} onClose={handleCloseModal2}>
        <Paper
          sx={{
            ...modalStyle,
            ...(isModalOpen2 && modalOpenStyle),
          }}
        >
          <Typography
            textAlign={"center"}
            className="mb-3 display-3 text-success font-weight-bold"
          >
            Adicionar Produto
          </Typography>

          <TextField
            required
            className="my-2"
            label="Nome"
            variant="outlined"
            fullWidth
            value={newProduct.nome}
            onChange={(e) =>
              setNewProduct({ ...newProduct, nome: e.target.value })
            }
          />
          <TextField
            className="my-2"
            label="Descrição"
            variant="outlined"
            fullWidth
            value={newProduct.descricao}
            onChange={(e) =>
              setNewProduct({ ...newProduct, descricao: e.target.value })
            }
          />
          <TextField
            required
            className="my-2"
            label="Quantidade"
            variant="outlined"
            fullWidth
            value={newProduct.quantidade}
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantidade: e.target.value })
            }
          />
          <LocalizationProvider locale="pt-BR" dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={[
                "DatePicker",
                "MobileDatePicker",
                "DesktopDatePicker",
                "StaticDatePicker",
              ]}
            >
              <DemoItem>
                <DatePicker
                  format="DD/MM/YYYY"
                  required
                  className="my-2"
                  label="Data de Compra"
                  variant="outlined"
                  fullWidth
                  value={newProduct.datacompra}
                  onChange={(date) =>
                    setNewProduct({ ...newProduct, datacompra: date })
                  }
                />{" "}
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>

          <TextField
            required
            className="my-2"
            label="Preço de Compra"
            variant="outlined"
            fullWidth
            value={newProduct.precocompra}
            onChange={(e) =>
              setNewProduct({ ...newProduct, precocompra: e.target.value })
            }
          />
          <TextField
            required
            className="my-2"
            label="Preço de Venda"
            variant="outlined"
            fullWidth
            value={newProduct.precovenda}
            onChange={(e) =>
              setNewProduct({ ...newProduct, precovenda: e.target.value })
            }
          />
          <TextField
            required
            className="my-2"
            label="ID da Categoria"
            variant="outlined"
            fullWidth
            value={newProduct.id_categoria}
            onChange={(e) =>
              setNewProduct({ ...newProduct, id_categoria: e.target.value })
            }
          />

          <TextField
            type="file"
            className="my-2"
            variant="outlined"
            fullWidth
            value={newProduct.imagem}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imagem: e.target.value })
            }
          />

          <Button
            className="btn btn-block my-2 btn-lg"
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
          >
            Adicionar
          </Button>
        </Paper>
      </Modal>
    </div>
  );
}
