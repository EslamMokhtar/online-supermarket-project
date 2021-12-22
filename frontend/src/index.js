import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import CartProvider from "./shared/context/cart-provider";
import AuthProvider from "./shared/context/auth-provider";

ReactDOM.render(
  <AuthProvider>
    <CartProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </CartProvider>
  </AuthProvider>,
  document.getElementById("root")
);
