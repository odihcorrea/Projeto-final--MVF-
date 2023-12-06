import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const listItemStyle = {
  "&:hover": {
    color: "white",
    background: "gray"

  },
};

export const mainListItems = (
  <React.Fragment>
    <ListItemButton to='dashboard' sx={listItemStyle}>
      <ListItemIcon>
        <DashboardIcon className="text-light" />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton to='estoque' sx={listItemStyle} className="bg-success">
      <ListItemIcon>
        <AssignmentIcon className="text-light" />
      </ListItemIcon>
      <ListItemText primary="Produtos" />
    </ListItemButton>
    <ListItemButton to='vendas' sx={listItemStyle}>
      <ListItemIcon>
        <ShoppingCartIcon className="text-light" />
      </ListItemIcon>
      <ListItemText primary="Vendas" />
    </ListItemButton>
    <ListItemButton to='clientes' sx={listItemStyle}>
      <ListItemIcon>
        <PeopleIcon className="text-light" />
      </ListItemIcon>
      <ListItemText primary="Clientes" />
    </ListItemButton>
    <ListItemButton to='/' sx={listItemStyle}>
      <ListItemIcon>
        <ExitToAppIcon className="text-light" />
      </ListItemIcon>
      <ListItemText primary="Sair" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = <React.Fragment></React.Fragment>;
