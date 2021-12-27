import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";

const drawerWidth = 300;

const openedMixin = (theme) => ({
  width: drawerWidth,

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",

  backgroundColor: theme.palette.primary.main,
  width: `calc(${theme.spacing(7)} + 10px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(9, 1, 0, 1),
  [theme.breakpoints.up("1000")]: {
    display: "none",
  },
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,

  whiteSpace: "nowrap",
  boxSizing: "border-box",
  [theme.breakpoints.down("1000")]: {
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  },
}));

const NList = styled(List, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  [theme.breakpoints.up("1000")]: {
    marginTop: "80px",
  },
  width: drawerWidth,
}));

export default function SideDrawer(props) {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { category } = useParams();
  const [selectedIndex, setSelectedIndex] = React.useState(category);

  const handleListItemClick = (event, index, categoryFrom) => {
    setSelectedIndex(categoryFrom);

    props.onClickQuery(category);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <MuiDrawer variant="temporary" open={open} onClose={handleDrawerClose}>
          <DrawerHeader>
            <IconButton>
              {!open ? (
                <ChevronRightIcon onClick={handleDrawerOpen} />
              ) : (
                <ChevronLeftIcon onClick={handleDrawerClose} />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />

          <NList component="nav" onClick={handleDrawerClose}>
            <ListItem
              button
              key="All"
              component={NavLink}
              to="/"
              exact
              selected={selectedIndex === "all"}
              onClick={(event) => handleListItemClick(event, 0, "all")}
            >
              <ListItemIcon>
                <Avatar src="https://img.icons8.com/color/48/000000/shop.png" />
              </ListItemIcon>
              <ListItemText primary="All Products" />
            </ListItem>

            <ListItem
              button
              key="Vegetables"
              component={NavLink}
              to="/categories/vegetables"
              exact
              selected={selectedIndex === "vegetables"}
              onClick={(event) => handleListItemClick(event, 0, "vegetables")}
            >
              <ListItemIcon>
                <Avatar src="https://img.icons8.com/color/48/000000/lettuce.png" />
              </ListItemIcon>
              <ListItemText primary="Vegetables" />
            </ListItem>
            <ListItem
              button
              key="Fruits"
              component={NavLink}
              to="/categories/fruits"
              exact
              selected={selectedIndex === "fruits"}
              onClick={(event) => handleListItemClick(event, 0, "fruits")}
            >
              <ListItemIcon>
                <Avatar src="https://img.icons8.com/color/48/000000/apple.png" />
              </ListItemIcon>
              <ListItemText primary="Fruits" />
            </ListItem>

            <ListItem
              button
              key="Meat"
              component={NavLink}
              to="/categories/meat"
              exact
              selected={selectedIndex === "meat"}
              onClick={(event) => handleListItemClick(event, 0, "meat")}
            >
              <ListItemIcon>
                <Avatar src="https://img.icons8.com/color/48/000000/steak.png" />
              </ListItemIcon>
              <ListItemText primary="Meat" />
            </ListItem>
            <ListItem
              button
              key="Dairy"
              component={NavLink}
              to="/categories/dairy"
              exact
              selected={selectedIndex === "dairy"}
              onClick={(event) => handleListItemClick(event, 0, "dairy")}
            >
              <ListItemIcon>
                <Avatar src="https://img.icons8.com/color/48/000000/milk-carton.png" />
              </ListItemIcon>
              <ListItemText primary="Dairy" />
            </ListItem>
            <ListItem
              button
              key="Bakery"
              component={NavLink}
              to="/categories/bakery"
              exact
              selected={selectedIndex === "bakery"}
              onClick={(event) => handleListItemClick(event, 0, "bakery")}
            >
              <ListItemIcon>
                <Avatar src="https://img.icons8.com/color/48/000000/bread.png" />
              </ListItemIcon>
              <ListItemText primary="Bakery" />
            </ListItem>
          </NList>
        </MuiDrawer>
      </Box>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {!open ? (
              <ChevronRightIcon onClick={handleDrawerOpen} />
            ) : (
              <ChevronLeftIcon onClick={handleDrawerClose} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <NList component="nav" onClick={handleDrawerClose}>
          <ListItem
            button
            key="All"
            component={NavLink}
            to="/"
            exact
            selected={selectedIndex === "all"}
            onClick={(event) => handleListItemClick(event, 1, "all")}
          >
            <ListItemIcon>
              <Avatar src="https://img.icons8.com/color/48/000000/shop.png" />
            </ListItemIcon>
            <ListItemText primary="All Products" />
          </ListItem>

          <ListItem
            button
            key="Vegetables"
            component={NavLink}
            to="/categories/vegetables"
            exact
            selected={selectedIndex === "vegetables"}
            onClick={(event) => handleListItemClick(event, 0, "vegetables")}
          >
            <ListItemIcon>
              <Avatar src="https://img.icons8.com/color/48/000000/lettuce.png" />
            </ListItemIcon>
            <ListItemText primary="Vegetables" />
          </ListItem>
          <ListItem
            button
            key="Fruits"
            component={NavLink}
            to="/categories/fruits"
            exact
            selected={selectedIndex === "fruits"}
            onClick={(event) => handleListItemClick(event, 0, "fruits")}
          >
            <ListItemIcon>
              <Avatar src="https://img.icons8.com/color/48/000000/apple.png" />
            </ListItemIcon>
            <ListItemText primary="Fruits" />
          </ListItem>

          <ListItem
            button
            key="Meat"
            component={NavLink}
            to="/categories/meat"
            exact
            selected={selectedIndex === "meat"}
            onClick={(event) => handleListItemClick(event, 0, "meat")}
          >
            <ListItemIcon>
              <Avatar src="https://img.icons8.com/color/48/000000/steak.png" />
            </ListItemIcon>
            <ListItemText primary="Meat" />
          </ListItem>
          <ListItem
            button
            key="Dairy"
            component={NavLink}
            to="/categories/dairy"
            exact
            selected={selectedIndex === "dairy"}
            onClick={(event) => handleListItemClick(event, 0, "dairy")}
          >
            <ListItemIcon>
              <Avatar src="https://img.icons8.com/color/48/000000/milk-carton.png" />
            </ListItemIcon>
            <ListItemText primary="Dairy" />
          </ListItem>
          <ListItem
            button
            key="Bakery"
            component={NavLink}
            to="/categories/bakery"
            exact
            selected={selectedIndex === "bakery"}
            onClick={(event) => handleListItemClick(event, 0, "bakery")}
          >
            <ListItemIcon>
              <Avatar src="https://img.icons8.com/color/48/000000/bread.png" />
            </ListItemIcon>
            <ListItemText primary="Bakery" />
          </ListItem>
        </NList>
      </Drawer>
    </React.Fragment>
  );
}
