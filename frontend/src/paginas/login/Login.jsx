import React, { useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import Button from "@mui/material/Button";
import { Snackbar, Stack } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login() {
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

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [senha, setSenha] = useState("");
  

  const handleEntrarClick = () => {
    if (senha === "123456") {
      window.location.href = "/dashboard"; // Redireciona para a página de dashboard
    } else {
      chamarSnackbar("warning", "Usuário e/ou senha não encontrados");
    }
  };

  return (
    <MDBContainer fluid className="mb-5">
      <nav className="navbar bg-body-tertiary bg-success mb-5 p-3 mt-0">
        <div className="container-fluid">
          <h1 className="display-5 text-light m-auto p-1">
            AC - GESTÃO DE VENDAS
          </h1>
        </div>
      </nav>

      <MDBRow className="justify-content-center m-5">
        <MDBCol col="10" md="5" className="mb-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/753/753210.png"
            className="img-fluid"
            alt="Phone image"
          />
        </MDBCol>

        <MDBCol col="4" md="6" className="m-auto">
          <MDBInput
            wrapperClass="mb-4"
            label="Usuário"
            id="email"
            type="email"
            size="lg"
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Senha"
            id="senha"
            type="password"
            size="lg"
            value={senha} // Defina o valor do campo como o estado "senha"
            onChange={(e) => setSenha(e.target.value)} // Atualize o estado "senha" quando o campo for alterado
          />

          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Lembrar-me"
            />
            <a href="!#">Esqueceu a senha?</a>
          </div>

          <Button
            onClick={handleEntrarClick} // Adicione um manipulador de cliques
            variant="contained"
            className="p-2 mb-4 w-100 text-light bg-danger"
            size="lg"
          >
            Entrar
          </Button>
        </MDBCol>
      </MDBRow>

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
    </MDBContainer>
  );
}

export default Login;
