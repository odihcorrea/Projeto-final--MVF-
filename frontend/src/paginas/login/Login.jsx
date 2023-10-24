import React from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import Button from '@mui/material/Button';


function Login() {
  return (
    <MDBContainer fluid className="mb-5">
      
      <nav className="navbar bg-body-tertiary bg-primary mb-5 p-3 mt-0">
        <div className="container-fluid">
          <h1 className="display-5 text-light m-auto p-1">AC - GESTÃO DE VENDAS</h1>
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
            label="Email"
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

          <Button href="dashboard" variant="contained" className="p-2 mb-4 w-100 text-light" size="lg">
            Entrar
          </Button>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
