import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton className="bg-primary" to='dashboard'>
      <ListItemIcon>
        <DashboardIcon className=" text-light" />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton to='estoque'>
      <ListItemIcon>
        <AssignmentIcon className="text-light" />
      </ListItemIcon>
      <ListItemText primary="Produtos" />
    </ListItemButton>
    <ListItemButton to='vendas'>
      <ListItemIcon>
        <ShoppingCartIcon className="text-light" />
      </ListItemIcon>
      <ListItemText primary="Vendas" />
    </ListItemButton>
    <ListItemButton to='clientes'>
      <ListItemIcon>
        <PeopleIcon className="text-light" />
      </ListItemIcon>
      <ListItemText primary="Clientes" />
    </ListItemButton>
    <ListItemButton to="/">
      <ListItemIcon>
        <ExitToAppIcon className="text-light" />
      </ListItemIcon>
      <ListItemText primary="Sair" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = <React.Fragment></React.Fragment>;
