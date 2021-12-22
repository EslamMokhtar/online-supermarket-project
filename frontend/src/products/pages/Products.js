import ProductList from "../components/ProductsList";
import { makeStyles } from "@mui/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";

import React from "react";
import { useParams } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const SAlert = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: "100%",
  [theme.breakpoints.down("599")]: {
    width: "75%",
    marginLeft: "15%",
  },
}));
const Products = (props) => {
  const { category } = useParams();
  const classes = useStyles();
  let filtered = props.items;
  if (category) {
    filtered = props.items.filter((items) => items.category === category);
  }
  return (
    <>
      <ProductList
        onDelete={props.onDelete}
        items={filtered}
        loading={props.loading}
      />
      <Snackbar
        open={props.open}
        autoHideDuration={3000}
        onClose={props.handleSnackBarClose}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <SAlert
          onClose={props.handleSnackBarClose}
          severity={props.error ? "error" : "success"}
        >
          {props.message}
        </SAlert>
      </Snackbar>
    </>
  );
};

export default Products;
