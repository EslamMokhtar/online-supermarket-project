import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import CartContext from "../../context/cart-context";
import { useContext, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import AuthContext from "../../context/auth-context";

const theme = createTheme({
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});
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
const CartModal = (props) => {
  const [submit, setSubmit] = useState(false);
  const ctx = useContext(CartContext);
  const ctxAuth = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const rows = ctx.cartItems;

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const addItem = (item) => {
    ctx.addToCart({ ...item, quantity: 1 });
  };

  const subItem = (item) => {
    ctx.subFromCart(item);
  };
  const removeItem = (item) => {
    ctx.removeFromCart(item);
  };
  let total = 0;
  let prePrice = 0;
  rows.map((item) => {
    total = total + item.price * item.quantity;
    if (item.prePrice) {
      prePrice =
        prePrice + (item.prePrice * item.quantity - item.price * item.quantity);
    }
  });

  const matches = useMediaQuery("(min-width:1000px)");
  let width = "90vw";

  if (matches) {
    width = "30vw";
  }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "20px",
  };
  const [loading, setLoading] = useState(false);
  const [error, showError] = React.useState({ show: false, message: "" });
  const handleClose = () => {
    props.handleClose();
    showError({ show: false, message: "" });
    setSubmit(false);
  };
  const handleCartSubmit = async () => {
    if (!ctxAuth.isAuth) {
      return setOpen(true);
    }
    setLoading(true);
    let response;

    try {
      response = await axios.post("http://127.0.0.1:5000/api/orders/", {
        id: ctxAuth.uid,
        items: ctx.cartItems,
        total: total,
      });

      props.getResponse(response);
      ctx.clearCart();
      setSubmit(true);
      setLoading(false);
    } catch (error) {
  
      showError({ show: true, message: "Can't submit yor order, try again." });
      setSubmit(false);
      setLoading(false);
      ctx.clearCart();
    }
  };
  if (error.show) {
    return (
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={6}
            sx={{ mt: "30px" }}
          >
            <Typography
              id="modal-modal-title"
              variant={matches ? "h3" : "h4"}
              component="h3"
              sx={{ mb: "20px", textAlign: "center" }}
            >
              Shopping Cart.
            </Typography>
            <lottie-player
              autoplay
              loop
              mode="normal"
              src="https://assets5.lottiefiles.com/private_files/lf30_glnkkfua.json"
              style={{ width: "320px", height: "200px" }}
            ></lottie-player>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h6"
              sx={{ mb: "20px", textAlign: "center" }}
            >
              {error.message}
            </Typography>
            <ThemeProvider theme={theme}>
              <Button
                size="medium"
                color="neutral"
                variant="contained"
                onClick={handleClose}
              >
                Close
              </Button>
            </ThemeProvider>
          </Stack>
        </Box>
      </Modal>
    );
  }
  if (submit) {
    return (
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={4}
            sx={{ mt: "30px" }}
          >
            <Typography
              id="modal-modal-title"
              variant={matches ? "h3" : "h4"}
              component="h3"
              sx={{ mb: "20px", textAlign: "center" }}
            >
              Shopping Cart.
            </Typography>
            <lottie-player
              autoplay
              loop
              mode="normal"
              src="https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json"
              style={{ width: "320px" }}
            ></lottie-player>
            <Typography id="modal-modal-title" variant="h4" component="h4">
              Thank You!
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h6">
              The order was submitted succsfully.
            </Typography>
            <Button
              size="medium"
              variant="outlined"
              color="success"
              onClick={handleClose}
            >
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>
    );
  }

  if (rows.length === 0) {
    return (
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={6}
            sx={{ mt: "30px" }}
          >
            <Typography
              id="modal-modal-title"
              variant={matches ? "h3" : "h4"}
              component="h3"
              sx={{ mb: "20px", textAlign: "center" }}
            >
              Shopping Cart.
            </Typography>
            <lottie-player
              autoplay
              loop
              mode="normal"
              src="https://assets1.lottiefiles.com/private_files/lf30_bn5winlb.json"
              style={{ width: "320px", height: "200px" }}
            ></lottie-player>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h6"
              sx={{ mb: "20px", textAlign: "center" }}
            >
              Your shopping cart is empty!
            </Typography>
            <ThemeProvider theme={theme}>
              <Button
                size="medium"
                color="neutral"
                variant="contained"
                onClick={handleClose}
              >
                Close
              </Button>
            </ThemeProvider>
          </Stack>
        </Box>
      </Modal>
    );
  }
  return (
    <>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h3"
            component="h2"
            sx={{ mb: "20px" }}
          >
            Shopping Cart.
          </Typography>
          <TableContainer sx={{ height: 315 }}>
            <Table aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography>Product</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography>Quantity</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>Total Price</Typography>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={row.image} />
                        <Typography>{row.title}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" alignItems="center">
                        <Button
                          aria-label="reduce"
                          size="small"
                          onClick={subItem.bind(null, row)}
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>
                        <Typography>{row.quantity}</Typography>
                        <Button
                          aria-label="increase"
                          size="small"
                          onClick={addItem.bind(null, row)}
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>
                        ${(row.price * row.quantity).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        aria-label="remove"
                        size="small"
                        onClick={removeItem.bind(null, row)}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider fullwidth />
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ mt: "10px" }}
          >
            {prePrice > 0 && (
              <Typography variant="body2" color="red">
                You save: $-{prePrice.toFixed(2)}
              </Typography>
            )}
            <Typography variant="h5">Total: ${total.toFixed(2)}</Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ mt: "30px" }}
          >
            <Button size="medium" variant="outlined" onClick={handleClose}>
              Back
            </Button>
            <LoadingButton
              size="medium"
              variant="contained"
              color="success"
              loading={loading}
              onClick={handleCartSubmit}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <SAlert onClose={handleSnackBarClose} severity="error">
          You should
          <Button
            size="small"
            variant="text"
            sx={{ color: "#001BFF" }}
            onClick={() => {
              setOpen(false);
              props.handleClose();
            }}
            component={Link}
            to="/login"
            exact
          >
            Login
          </Button>
          first!
        </SAlert>
      </Snackbar>
    </>
  );
};

export default CartModal;
