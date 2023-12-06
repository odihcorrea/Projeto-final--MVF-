import React from "react";
import { Route, Routes } from "react-router-dom";
import Clientes from "./paginas/Clientes/Cliente";
import Error from "./Error";
import Vendas from "./paginas/Venda/Vendas"
import Estoque from "./paginas/Estoques/Estoque";
import Dashboard from "./paginas/Dashboards/Dashboard";
import Login from "./paginas/Logins/Login";
import Recuperar from "./paginas/Logins/Recuperar";
import Cadastro from "./paginas/Logins/Cadastro";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="dashboard" element={<Dashboard />}></Route>
      <Route path="vendas" element={<Vendas />}></Route>
      <Route path="estoque" element={<Estoque />}></Route>
      <Route path="*" element={<Error />}> </Route>
      <Route path="clientes" element={<Clientes />}> </Route>
      <Route path="cadastro" element={<Cadastro />}> </Route>
      <Route path="recuperar" element={<Recuperar />}> </Route>
    </Routes>
  );
}

export default AppRoutes;
