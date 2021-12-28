import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SideDrwaer from "./shared/components/Navigation/SideDrawer";
import Grid from "@mui/material/Grid";
import Error from "./shared/Error";
import { useState, useContext, lazy } from "react";
import CartContext from "./shared/context/cart-context";
import AuthContext from "./shared/context/auth-context";
import React, { Suspense } from "react";
import axios from "axios";
import IsAuth from "./auth/components/isAuth";
import IsAdmin from "./auth/components/isAdmin";
import IsLogin from "./auth/components/isLogin";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Loading from "./shared/components/Navigation/Loading";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const Login = lazy(() => import("./auth/pages/Login"));
const Orders = lazy(() => import("./user/pages/Orders"));
const Products = lazy(() => import("./products/pages/Products"));
const Order = lazy(() => import("./user/pages/Order"));
const CreateAccount = lazy(() => import("./auth/pages/CreateAccount"));
const AddProduct = lazy(() => import("./products/pages/AddProduct"));
const firebaseConfig = {
  apiKey: "AIzaSyCuhcwssVD0wcRLHfPJJx39usiG57Ii79w",
  authDomain: "online-supermarket-f7555.firebaseapp.com",
  projectId: "online-supermarket-f7555",
  storageBucket: "online-supermarket-f7555.appspot.com",
  messagingSenderId: "777714888819",
  appId: "1:777714888819:web:2518f9a52d9b513ca73a06",
  measurementId: "G-CWJND2CSFH",
};
const theme = createTheme();
let first = true;
let logoutTimer;
const App = () => {
  const ctx = useContext(CartContext);
  const ctxAuth = useContext(AuthContext);
  const { uid, token, handleLogin, handleLogout, tokenExpirationDate } =
    ctxAuth;
  const [items, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [orderLoading, setOrderLoading] = React.useState(true);
  const [products, setProduct] = useState(items);
  const [search, setSearch] = useState("");
  const [itemsHome, setItems] = useState(items);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    error: false,
  });
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  React.useEffect(() => {
    const check = async () => {
      let response;
      try {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        const url = `${process.env.REACT_APP_BACKEND_URL}/users/check`;
        response = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + storedData.token,
          },
        });
        if (
          storedData &&
          storedData.token &&
          new Date(storedData.expiration) > new Date()
        ) {
          handleLogin(
            storedData.userId,
            storedData.token,
            new Date(storedData.expiration),
            response.data.admin
          );
        }
        first = false;
      } catch (err) {
        first = false;
      }
    };
    check();
  }, [handleLogin]);

  React.useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(handleLogout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationDate, handleLogout]);

  const connectToDb = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products/`
      );

      setProducts(response.data.products);
      setProduct(response.data.products);
      setItems(response.data.products);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getOrders = React.useCallback(async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/orders/${uid}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    setOrders(response.data.orders);
    setOrderLoading(false);
  }, [uid, token]);
  React.useEffect(() => {
    connectToDb();
  }, []);
  React.useEffect(() => {
    if (uid) {
      getOrders();
    }
  }, [uid, getOrders]);
  const addProductHandler = (product, message) => {
    if (!product) {
      return setAlert({
        show: true,
        message: "Adding product failed",
        error: true,
      });
    }
    setAlert({ show: true, message });
    setItems([...items, product]);
    setProduct([...items, product]);
    setProducts([...items, product]);
  };
  const editProductHandler = async (product) => {
    const allProducts = [...products];
    const index = allProducts.findIndex((item) => item._id === product._id);
    allProducts[index] = product;
    setItems(allProducts);
    setProduct(allProducts);
    setProducts(allProducts);
    ctx.updateItem(product);
    let response;
    try {
      response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/products/${product._id}`,
        {
          ...product,
        },
        {
          headers: {
            Authorization: "Bearer " + ctxAuth.token,
          },
        }
      );
      setAlert({ show: true, message: response.data.message });
    } catch (err) {
      setAlert({
        show: true,
        message: "Editing to server failed",
        error: true,
      });
    }
  };

  const changeHandler = (e) => {
    setSearch(e);
    const results = itemsHome.filter((product) =>
      product.title.toLowerCase().includes(e.toLowerCase())
    );
    setProduct(results);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ show: false, message: "" });
  };

  const onDeleteHandler = async (id) => {
    const product = products.find((item) => item._id === id);
    ctx.removeFromCart(product);
    setProduct(products.filter((product) => product._id !== id));
    setProducts(products.filter((product) => product._id !== id));
    setItems(products.filter((product) => product._id !== id));

    let response;
    try {
      response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/products/${id}`,
        {
          headers: {
            Authorization: "Bearer " + ctxAuth.token,
          },
        }
      );
      setAlert({ show: true, message: response.data.message });
    } catch (err) {
      setAlert({
        show: true,
        message: "Deleting from server failed",
        error: true,
      });
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const getResponse = (response) => {
    setOrders([response.data.result, ...orders]);
  };
  const onClickQuery = (query) => {
    setSearchQuery(query);
  };

  if (first) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={first}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <MainNavigation
          onchangeHandler={changeHandler}
          value={search}
          getResponse={getResponse}
        />
        <Suspense fallback={<Loading />}>
          <Grid container>
            <Switch>
              <Route path="/" exact>
                <Grid item sm={2} xs={2} md={4} xl={2}>
                  <SideDrwaer onClickQuery={onClickQuery} />
                </Grid>
                <Grid item sm={10} xs={10} md={8} xl={10}>
                  <Products
                    onDelete={onDeleteHandler}
                    items={products}
                    loading={loading}
                    handleSnackBarClose={handleSnackBarClose}
                    open={alert.show}
                    message={alert.message}
                    error={alert.error}
                  />
                </Grid>
              </Route>
              <Route path="/orders" exact>
                <IsAuth>
                  <Grid item xs={12}>
                    <Orders orders={orders} loading={orderLoading} />
                  </Grid>
                </IsAuth>
              </Route>
              <Route path="/order/:oid" exact>
                <IsAuth>
                  <Grid item xs={12}>
                    <Order orders={orders} loading={orderLoading} />
                  </Grid>
                </IsAuth>
              </Route>
              <Route path="/login" exact>
                <IsLogin>
                  <Grid item xs={12}>
                    <Login />
                  </Grid>
                </IsLogin>
              </Route>
              <Route path="/create-account" exact>
                <IsLogin>
                  <Grid item xs={12}>
                    <CreateAccount />
                  </Grid>
                </IsLogin>
              </Route>
              <Route path="/add-product" exact>
                <IsAuth>
                  <IsAdmin>
                    <Grid item xs={12}>
                      <AddProduct
                        items={products}
                        edit={false}
                        onAddProduct={addProductHandler}
                      />
                    </Grid>
                  </IsAdmin>
                </IsAuth>
              </Route>
              <Route path="/edit-product/:id" exact>
                <IsAuth>
                  <IsAdmin>
                    <Grid item xs={12}>
                      {loading ? (
                        <Loading />
                      ) : (
                        <AddProduct
                          items={products}
                          edit={true}
                          onEditProduct={editProductHandler}
                        />
                      )}
                    </Grid>
                  </IsAdmin>
                </IsAuth>
              </Route>
              <Route path="/categories/:category" exact>
                <Grid item sm={2} xs={2} md={4} xl={2}>
                  <SideDrwaer onClickQuery={onClickQuery} />
                </Grid>
                <Grid item sm={10} xs={10} md={8} xl={10}>
                  <Products onDelete={onDeleteHandler} items={products} />
                </Grid>
              </Route>
              <Route path="*">
                <Error />
              </Route>
            </Switch>
          </Grid>
        </Suspense>
      </ThemeProvider>
    </Router>
  );
};

export default App;
