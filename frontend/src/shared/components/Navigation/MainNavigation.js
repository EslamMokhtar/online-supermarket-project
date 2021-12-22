import MainHeader from "./MainHeader";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Badge,
  Avatar,
  alpha,
  Box,
  IconButton,
} from "@mui/material";
import {
  Cancel,
  Search,
  ShoppingCart,
  ShoppingBasket,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CartModal from "./CartModal";
import CartContext from "../../context/cart-context";
import { useContext } from "react";
import { headShake } from "react-animations";
import { StyleSheet, css } from "aphrodite";
import AuthContext from "../../context/auth-context";

const styles = StyleSheet.create({
  headShake: {
    animationName: headShake,
    animationDuration: "1s",
  },
});

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },

  logoLg: {
    "&:hover": {
      color: "whitesmoke",
    },
    textDecoration: "none",
    color: "white",
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  logoSm: {
    "&:hover": {
      color: "whitesmoke",
    },
    textDecoration: "none",
    color: "white",
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },

  search: {
    display: "flex",
    alignItems: "center",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      display: (props) => (props.open ? "flex" : "none"),
      width: "60%",
    },
  },
  input: {
    color: "white",
    width: "100%",
    marginLeft: theme.spacing(1),
  },
  cancel: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  searchButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  icons: {
    alignItems: "center",
    display: (props) => (props.open ? "none" : "flex"),
  },
  badge: {
    marginRight: theme.spacing(2),
  },
  searchIcon: {
    marginLeft: theme.spacing(1),
  },
  buttonActive: {
    "&.active": {
      color: "black",
    },
  },
}));

const MainNavigation = (props) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCart, setOpenCart] = useState(false);
  const classes = useStyles({ open });
  const location = useLocation();

  const ctx = useContext(CartContext);
  const ctxAuth = useContext(AuthContext);
  const openAnchor = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseCart = () => {
    setOpenCart(false);
  };
  const handleLogout = () => {
    ctxAuth.handleLogout();
    setAnchorEl(null);
  };

  return (
    <MainHeader>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.logoLg}>
            <Link to="/" style={{ textDecoration: " none", color: "white" }}>
              <ShoppingBasket /> Online Supermarket
            </Link>
          </Typography>
          <Typography variant="h6" className={classes.logoSm}>
            <Link to="/" style={{ textDecoration: " none", color: "white" }}>
              Supermarket
            </Link>
          </Typography>
          {(location.pathname === "/" ||
            location.pathname.includes("categories")) && (
            <div className={classes.search}>
              <Search className={classes.searchIcon} />
              <InputBase
                placeholder="Search..."
                className={classes.input}
                onChange={(e) => props.onchangeHandler(e.target.value)}
                value={props.value}
              />
              <Box className={classes.cancel}>
                <Cancel onClick={() => setOpen(false)} />
              </Box>
            </div>
          )}
          <div className={classes.icons}>
            {(location.pathname === "/" ||
              location.pathname.includes("categories")) && (
              <Box className={classes.searchButton}>
                <Search onClick={() => setOpen(true)} />
              </Box>
            )}
            <IconButton
              size="medium"
              aria-label="show 2 new notifications"
              color="inherit"
              onClick={() => setOpenCart(true)}
            >
              <Box className={ctx.checked && css(styles.headShake)}>
                <Badge
                  badgeContent={ctx.cartLogo}
                  color="error"
                  className={classes.badge}
                >
                  <ShoppingCart fontSize="large" />
                </Badge>
              </Box>
            </IconButton>
            {!ctxAuth.isAuth ? (
              <IconButton
                size="large"
                aria-label="account of current user"
                color="inherit"
                component={NavLink}
                to="/login"
                exact
              >
                <Avatar alt="User" />
              </IconButton>
            ) : (
              <IconButton
                size="large"
                aria-label="account of current user"
                color="inherit"
              >
                <Avatar
                  id="basic-button"
                  aria-controls="basic-menu"
                  aria-haspopup="true"
                  aria-expanded={openAnchor ? "true" : undefined}
                  onClick={handleClick}
                />

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openAnchor}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  {ctxAuth.isAdmin && (
                    <MenuItem
                      component={NavLink}
                      to="/add-product"
                      onClick={handleClose}
                    >
                      Add Product
                    </MenuItem>
                  )}
                  <MenuItem
                    component={NavLink}
                    to="/orders"
                    onClick={handleClose}
                  >
                    Your orders
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                </Menu>
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <CartModal
        handleClose={handleCloseCart}
        getResponse={props.getResponse}
        open={openCart}
      />
    </MainHeader>
  );
};

export default MainNavigation;
