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
  Input,
  CardMedia,
  CardContent,
  Card,
  Snackbar,
  Stack,
} from "@mui/material";

import MuiAlert from "@mui/material/Alert";

import { AddCircleOutline as AddIcon } from "@mui/icons-material";
import { listCliente } from "../Services/service";
import { listCategoria } from "../Services/service";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Axios from "axios";
import dayjs from "dayjs";

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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Cliente() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchCategoria, setSearchCategoria] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [isCategoriaModalOpen, setCategoriaModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [newProduct, setNewProduct] = useState({
    nome: null,
    cpf: null,
    endereco: null,
    datanascimento: null,
    contato: null,
  });

  const [categoria, setCategorias] = useState([{ nome: "" }]);

  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...selectedProduct });

  const [buttonClass, setButtonClass] = useState("bg-primary");
  const [retornoDel, setRetornoDel] = useState(false);

  const [categoriaChange, setCategoriaChange] = useState();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  const findCategoriaNameById = (id) => {
    const foundCategoria = categoria.find((cat) => cat.id === id);
    return foundCategoria ? foundCategoria.nome : "Sem Categoria";
  };

  const handleCategoriaChange = (e) => {
    setCategoriaChange(
      isEditing
        ? findCategoriaNameById(editedProduct.id_categoria)
        : findCategoriaNameById(e.id_categoria)
    );
  };

  const handleCadastrarCategoria = () => {
    setIsAddingCategory(true);
  };

  const handleSalvarNovaCategoria = () => {
    // Verifica se o novo nome da categoria não está vazio
    if (newCategory.trim() === "") {
      alert("Nome da categoria não pode estar vazio.");
      return;
    }

    // Aqui você deve adicionar a nova categoria à lista de categorias
    const novaCategoria = { nome: newCategory };

    Axios.post("http://localhost:3000/categoria/cadastrar", novaCategoria)
      .then((response) => {
        console.log(response.data); // Limpar o campo de nova categoria
        setIsAddingCategory(false);

        chamarSnackbar("success", "Nova categoria adicionada");

        // Atualizar a lista de categorias após adicionar uma nova
        listCategoria()
          .then((dados) => {
            setCategorias(dados);
            setNewCategory("");
          })
          .catch((error) => {
            console.error("Erro ao buscar categorias:", error);
          });
      })
      .catch((error) => {
        chamarSnackbar("danger", "Erro ao adicionar categoria");

        console.error("Erro ao cadastrar a nova categoria:", error);
      });

    // Em vez de um alert, você pode enviar a nova categoria para o servidor
    // ou fazer a manipulação necessári
    // Limpa o campo de texto e redefine o estado para não adicionar mais categorias.
  };

  useEffect(() => {
    listCategoria()
      .then((dados) => {
        setCategorias(dados);
      })
      .catch((error) => {
        console.error("Erro ao buscar categorias:", error);
      });
  }, []);

  useEffect(() => {
    async function fetchCategoria() {
      try {
        const data = await listCategoria();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao buscar os categorias:", error);
      }
    }

    fetchCategoria();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await listCliente();
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

  const handleSearchCategoriaChange = (e) => {
    setSearchCategoria(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredCategorias = categoria.filter((product) =>
    product.nome.toLowerCase().includes(searchCategoria.toLowerCase())
  );

  const handleDeleteProduto = async (id) => {
    try {
      await Axios.delete(`http://localhost:3000/cliente/deletar/${id}`);
      console.log("Cliente deletado com sucesso!");
      chamarSnackbar("success", "Cliente excluído");
      handleCloseModal();
      listCliente()
        .then((dados) => {
          setProducts(dados);
        })
        .catch((error) => {
          console.error("Erro ao buscar produtos:", error);
        }); // Depois de excluir o item, você pode atualizar a lista de produtos ou fazer outras ações necessárias.
    } catch (error) {
      chamarSnackbar("danger", "Erro - Cliente cadastrado em vendas");
      console.error("Erro ao excluir item:", error);
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    // Atualize o editedProduct ao abrir o modal
    setEditedProduct({ ...product });
    setModalOpen(true);
    handleCategoriaChange(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
    handleEditCancel();
    !isEditing;
    setButtonClass("bg-primary");
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

  const handleEditSave = () => {
    if (isEditing) {
      if (selectedProduct) {
        Axios.put(
          `http://localhost:3000/cliente/alterar/${selectedProduct.id}`,
          editedProduct // Envie o editedProduct, que agora reflete as edições
        )
          .then((response) => {
            console.log("cliente editado com sucesso:", response.data);
            chamarSnackbar("success", "Cliente atualizado");
            setIsEditing(false);
            // Atualize o estado local com os novos valores
            setSelectedProduct({ ...selectedProduct, ...editedProduct });
            handleCloseModal();
            setButtonClass("bg-primary");
            listCliente()
              .then((dados) => {
                setProducts(dados);
              })
              .catch((error) => {
                console.error("Erro ao buscar cliente:", error);
              });
          })
          .catch((error) => {
            chamarSnackbar("danger", "Erro ao atualizar cliente");
            console.error("Erro ao editar o cliente:", error);
          });
      }
    } else {
      setIsEditing(true); // Entre no modo de edição
      setButtonClass("bg-success");
    }
  };

  const handleEditCancel = () => {
    // Restaure os valores originais e saia do modo de edição
    setEditedProduct({ ...selectedProduct });
    setIsEditing(false);
  };

  const handleAddProduct = () => {
    Axios.post("http://localhost:3000/cliente/cadastrar", newProduct)
      .then((response) => {
        console.log(response.data);
        handleCloseModal2();
        chamarSnackbar("success", "Novo cliente adicionado");

        listCliente()
          .then((dados) => {
            setProducts(dados);
          })
          .catch((error) => {
            console.error("Erro ao buscar cliente:", error);
          });
      })
      .catch((error) => {
        chamarSnackbar("danger", "erro ao adicionar produto");
        console.error("Erro ao cadastrar a novo produto:", error);
      });

    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cliente/"); // Substitua pela sua URL
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }

      setNome(null);
      setCpf(null);
      setContato(null);
      setEndereco(null);
      setDataNascimento(null);
    };

    // Adicione aqui a lógica para enviar os dados do novo produto para o servidor.
    // Por enquanto, apenas exibiremos os dados no console.
    console.log("Novo Produto:", newProduct);
    // Limpar o formulário após adicionar o produto.
    setNewProduct({
      nome: null,
      cpf: null,
      endereco: null,
      contato: null,
      datanascimento: null,
    });
    handleCloseModal();
  };

  const colunasCategoria = [
    {
      field: "nome",
      headerName: "Nome",
      width: 300,
      renderCell: (params) => {
        if (params.row.id === categoriaEditando) {
          return (
            <>
              <input
                type="text"
                defaultValue={params.row.nome}
                onChange={(e) =>
                  setCategorias((categorias) =>
                    categorias.map((c) =>
                      c.id === params.row.id
                        ? { ...c, nome: e.target.value }
                        : c
                    )
                  )
                }
              />

              <IconButton onClick={() => handleSalvarEdicao(params.row)}>
                <CheckIcon />
              </IconButton>
              <IconButton onClick={handleCancelarEdicao}>
                <CancelIcon />
              </IconButton>
            </>
          );
        } else {
          return params.value;
        }
      },
    },
    {
      field: "selecionar",
      headerName: "Selecionar",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleSelectCategoria(params.row)}>
          <CheckIcon />
        </IconButton>
      ),
    },
    {
      field: "editar",
      headerName: "Editar",
      width: 70,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditarCategoria(params.row)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
    {
      field: "excluir",
      headerName: "Excluir",
      width: 70,
      renderCell: (params) => (
        <IconButton onClick={() => handleExcluirCategoria(params.row)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const columnsToShow = [
    { field: "nome", headerName: "Nome", width: 400 },
    {
      field: "cpf",
      headerName: "CPF",
      width: 150,
      align: "right",
    },
    {
      field: "datanascimento",
      headerName: "Data de Nascimento",
      width: 150,
      align: "right",
      valueFormatter: (params) => {
        if (params.value === null) {
          ("");
        } else {
          const date = new Date(params.value);
          return date.toLocaleDateString("pt-BR");
        }
      },
    },
    {
      field: "contato",
      headerName: "Contato",
      width: 150,
      align: "right"
    },
    {
      field: "endereco",
      headerName: "Endereço",
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

  const handleEditarCategoria = (categoria) => {
    setCategoriaEditando(categoria.id);
  };

  const handleSalvarEdicao = (categoriaEditando) => {
    if (categoriaEditando) {
      // Certifique-se de que a categoriaEditando não seja nula
      const categoriaAtualizada = categoria.find(
        (cat) => cat.id === categoriaEditando.id
      );

      if (categoriaAtualizada) {
        // Atualize a categoria no servidor
        atualizarCategoriaNoServidor(categoriaAtualizada);

        // Desabilite o modo de edição
        setCategoriaEditando(null);
      }
    }
  };

  const atualizarCategoriaNoServidor = (categoriaAtualizada) => {
    const url = `http://localhost:3000/categoria/alterar/${categoriaAtualizada.id}`;

    // Envia uma solicitação PUT para o servidor
    Axios.put(url, categoriaAtualizada)
      .then((response) => {
        chamarSnackbar("success", "Categoria atualizada");
        console.log("Categoria atualizada com sucesso:", response.data);
        // Coloque aqui qualquer lógica adicional após a atualização bem-sucedida
      })
      .catch((error) => {
        chamarSnackbar("danger", "Erro ao alterar categoria");
        console.error("Erro ao atualizar categoria:", error);
        // Trate os erros de acordo com suas necessidades
      });
  };

  const handleCancelarEdicao = () => {
    setCategoriaEditando(null);
  };

  const handleExcluirCategoria = async (e) => {
    try {
      await Axios.delete(`http://localhost:3000/categoria/deletar/${e.id}`);
      console.log("Item deletado com sucesso!");
      chamarSnackbar("success", "Categoria excluida");

      listCategoria()
        .then((dados) => {
          setCategorias(dados);
        })
        .catch((error) => {
          console.error("Erro ao buscar categorias:", error);
        }); // Depois de excluir o item, você pode atualizar a lista de produtos ou fazer outras ações necessárias.
    } catch (error) {
      chamarSnackbar(
        "warning",
        "Erro ao excluir - Categoria préviamente adicionada a um produto"
      );
      console.error("Erro ao excluir item:", error);
    }

    const novasCategorias = categoria.filter((cat) => cat.id !== categoria.id);
    setCategorias(novasCategorias);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProduct({ ...newProduct, imagem: reader.result });
        setEditedProduct({ ...editedProduct, imagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleOpenCategoriaModal = () => {
    setCategoriaModalOpen(true);
  };

  const handleCloseCategoriaModal = () => {
    setCategoriaModalOpen(false);
  };

  const handleSelectCategoria = (categoria) => {
    if (categoriaEditando === null) {
      setSelectedCategoria(categoria.nome);
      setNewProduct({ ...newProduct, id_categoria: categoria.id }); // Define a categoria selecionada no FieldSet
      setEditedProduct({ ...editedProduct, id_categoria: categoria.id });
      setCategoriaChange(findCategoriaNameById(categoria.id));

      handleCloseCategoriaModal();
    }
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
          Adicionar Cliente
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
              <Typography
                textAlign={"center"}
                className="mb-3 display-3 text-success font-weight-bold"
              >
                Detalhes do produto
              </Typography>
              <TextField
                InputLabelProps={{ shrink: "shrink" }}
                required
                className="my-1"
                label="Nome"
                variant="outlined"
                fullWidth
                disabled={!isEditing}
                defaultValue={
                  isEditing ? editedProduct.nome : selectedProduct.nome
                }
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, nome: e.target.value })
                }
              />
              <TextField
                InputLabelProps={{ shrink: "shrink" }}
                className="my-1"
                label="CPF"
                variant="outlined"
                fullWidth
                disabled={!isEditing}
                defaultValue={
                  isEditing ? editedProduct.cpf : selectedProduct.cpf
                }
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    cpf: e.target.value,
                  })
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
                      InputLabelProps={{ shrink: "shrink" }}
                      format="DD/MM/YYYY"
                      className="my-1"
                      label="Data de Nascimento"
                      variant="outlined"
                      fullWidth
                      disabled={!isEditing}
                      defaultValue={
                        selectedProduct && selectedProduct.datanascimento
                          ? dayjs(
                              isEditing
                                ? editedProduct.datanascimento
                                : selectedProduct.datanascimento
                            )
                          : null
                      }
                      onChange={(date) =>
                        setEditedProduct({
                          ...editedProduct,
                          datanascimento: date,
                        })
                      }
                    />{" "}
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
              <TextField
                InputLabelProps={{ shrink: "shrink" }}
                className="my-1"
                label="Contato"
                variant="outlined"
                fullWidth
                disabled={!isEditing}
                defaultValue={
                  isEditing ? editedProduct.contato : selectedProduct.contato
                }
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    contato: e.target.value,
                  })
                }
              />

              <TextField
                InputLabelProps={{ shrink: "shrink" }}
                className="my-1"
                label="Endereço"
                variant="outlined"
                fullWidth
                disabled={!isEditing}
                defaultValue={
                  isEditing ? editedProduct.endereco : selectedProduct.endereco
                }
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    endereco: e.target.value,
                  })
                }
              />

              <Button
                className={`btn btn-block btn-lg ${buttonClass}`} // Use a classe do estado
                variant="contained"
                onClick={handleEditSave}
              >
                {isEditing ? "Salvar" : "Editar"}
              </Button>
              <Button
                className="btn btn-block btn-lg bg-danger"
                variant="contained"
                color="primary"
                onClick={() => handleDeleteProduto(selectedProduct.id)} // Chame handleDeleteProduto com o ID do produto
              >
                excluir
              </Button>
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
            className="mb-2 display-3 text-success font-weight-bold"
          >
            Adicionar Cliente
          </Typography>
          <TextField
            required
            className="my-1"
            label="Nome do cliente"
            variant="outlined"
            fullWidth
            value={newProduct.nome}
            onChange={(e) =>
              setNewProduct({ ...newProduct, nome: e.target.value })
            }
          />
          <TextField
            className="my-1"
            label="CPF"
            variant="outlined"
            fullWidth
            value={newProduct.cpf}
            onChange={(e) =>
              setNewProduct({ ...newProduct, cpf: e.target.value })
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
                  className="my-1"
                  label="Data de nascimento"
                  variant="outlined"
                  fullWidth
                  value={newProduct.datanascimento}
                  onChange={(date) =>
                    setNewProduct({ ...newProduct, datanascimento: date })
                  }
                />{" "}
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
          <TextField
            className="my-1"
            label="Endereço"
            variant="outlined"
            fullWidth
            value={newProduct.endereco}
            onChange={(e) =>
              setNewProduct({ ...newProduct, endereco: e.target.value })
            }
          />

          <TextField
            className="my-1"
            label="Contato"
            variant="outlined"
            fullWidth
            value={newProduct.contato}
            onChange={(e) =>
              setNewProduct({ ...newProduct, contato: e.target.value })
            }
          />

          <Button
            className="btn btn-block btn-lg"
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
          >
            Adicionar Cliente
          </Button>
        </Paper>
      </Modal>

      <Modal open={isCategoriaModalOpen} onClose={handleCloseCategoriaModal}>
        <Paper
          sx={{
            ...modalStyle,
            ...(isCategoriaModalOpen && modalOpenStyle),
          }}
        >
          <Typography
            textAlign={"center"}
            className="mb-3 display-3 text-success font-weight-bold"
          >
            Selecione uma Categoria
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <TextField
              variant="outlined"
              label="Pesquisar por Nome"
              value={searchCategoria}
              onChange={handleSearchCategoriaChange}
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
          </Box>

          {/* Tabela de Categorias */}
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid rows={filteredCategorias} columns={colunasCategoria} />
          </div>

          <Box display="flex" justifyContent="end" className="my-3">
            {/* Linha para adicionar nova categoria */}
            <TextField
              fullWidth
              label="Nova Categoria"
              variant="outlined"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSalvarNovaCategoria}
            >
              Salvar
            </Button>
          </Box>
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
    </div>
  );
}
