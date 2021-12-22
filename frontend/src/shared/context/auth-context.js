import React from "react";

const AuthContext = React.createContext({
  isAuth: null,
  isAdmin: null,
  uid: "",
  tokenExpirationDate: null,
  token: null,
  handleLogin: async () => {},
  handleLogout: () => {},
});

export default AuthContext;
